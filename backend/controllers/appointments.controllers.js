import Stripe from 'stripe';
import Appointment from '../db/schema/appointments.models.js';
import Service from '../db/schema/services.models.js';
import { addJobToBullmq } from '../utils/bullmq/producer.bullmq.js';

const VITE_BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:5173';

export const getFreeSlots = async (req, res, next) => {
  try {
    const { serviceId, date } = req.query;

    console.log("Requested serviceId:", req.query.serviceId);

    if (!date) return res.status(400).json({ success: false, message: "Date is required" });

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });

    const { workingHours, serviceTime } = service;

    // Convert working hours to minutes
    const workStart = workingHours.start * 60;
    const workEnd = workingHours.end * 60;

    // Generate all possible slots in minutes
    const allSlots = [];
    for (let t = workStart; t + serviceTime <= workEnd; t += serviceTime) {
      allSlots.push([t, t + serviceTime]);
    }

    // Fetch all appointments for this service on the given date
    const startOfDay = new Date(date + "T00:00:00");
    const endOfDay = new Date(date + "T23:59:59");

    const appointments = await Appointment.find({
      service: serviceId,
      start: { $gte: startOfDay, $lte: endOfDay },
    });

    // Build busy slot time ranges in minutes
    const busySlots = appointments.map(app => {
      const startMinutes = app.start.getHours() * 60 + app.start.getMinutes();
      const endMinutes = app.end.getHours() * 60 + app.end.getMinutes();
      return [startMinutes, endMinutes];
    });

    // Sort busy slots
    busySlots.sort((a, b) => a[0] - b[0]);

    // Filter out busy slots from all slots
    const freeSlots = allSlots.filter(([start, end]) => {
      return !busySlots.some(([busyStart, busyEnd]) =>
        Math.max(start, busyStart) < Math.min(end, busyEnd) // overlap condition
      );
    });

// Helper to convert minutes to readable time (e.g. 600 → "10:00 AM")
const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const d = new Date();
  d.setHours(h, m, 0);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Merge and mark all slots
const mergedSlots = allSlots.map(([start, end]) => {
  const isBusy = busySlots.some(([busyStart, busyEnd]) =>
    Math.max(start, busyStart) < Math.min(end, busyEnd)
  );

  return {
    start: formatTime(start),
    end: formatTime(end),
    available: !isBusy
  };
});

return res.status(200).json({
  success: true,
  slots: mergedSlots
});


  } catch (error) {
    console.error("Error in getFreeSlots:", error);
    next(error);
  }
};



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const createPaymentController = async (req, res) => {
  try {
    const clientId = req.user?._id;
    const { serviceId, storeId, appointmentTime, appointmentDate, items = [] } = req.body;

    const {
        name,
        description,
        price,
        currency,
      } = items[0];

    if (!items.length) {
      return res.status(400).json({ error: "No items provided for checkout." });
    }

    // 1. Create Appointment
    const newAppointment = await Appointment.create({
      client: clientId,
      service: serviceId,
      store: storeId,
      appointmentTime,
      appointmentDate,
      status: "pending",
    });

    // 2. Build line_items array for Stripe
    const line_items = items.map(item => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error("Each item must have name, price (in cents), and quantity.");
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: item.currency || "usd",
          product_data: {
            name: item.name,
            description: item.description || "",
          },
          unit_amount: item.price, // price in cents
        },
      };
    });

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${VITE_BASE_URL}/appointments/`,
      cancel_url: `${VITE_BASE_URL}/cancel`,
      metadata: {
        appointmentId: newAppointment._id.toString(),
      },
    });

    // 4. Attach session ID to appointment
    newAppointment.checkoutSessionId = session.id;
    await newAppointment.save();

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: error.message });
  }
};




// Stripe Webhook Controller { APPOINTMENT CONFIRMATION ROUTE }
export const StripeWebhookController = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify Stripe signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    console.warn("⚠️ Received non-checkout.session.completed event");
    return res.status(200).send("Event ignored.");
  }

  const session = event.data.object;
  const appointmentId = session.metadata?.appointmentId;

  if (!appointmentId) {
    console.warn("⚠️ checkout.session.completed received without appointmentId metadata");
    return res.status(400).json({
      type: "error",
      message: "Missing appointmentId in Stripe metadata.",
    });
  }

  try {
    // Update appointment in DB
    const appointmentUpdateResponse = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: "succeeded",
        status: "scheduled",
        paymentIntentId: session.payment_intent,
        amountPaid: session.amount_total,
        currency: session.currency,
      },
      { new: true }
    );

    if (!appointmentUpdateResponse) {
      console.log("No appointment found with that ID!");
      return res.status(404).json({
        type: "error",
        message: "Appointment not found.",
      });
    }

    const appointmentTimeMs = appointmentUpdateResponse.appointmentTime.getTime();
    const delay = Math.max(appointmentTimeMs - Date.now(), 0);


    // Add -markDeleivery- job to BullMQ
    const jobInfoMarkDeleivery = {
      name: "markDelivering", // corrected spelling
      data: {
        appointmentId: appointmentUpdateResponse._id
      },
      delay
    };

    const jobMarkDeleiveryAddedResponse = await addJobToBullmq(jobInfoMarkDeleivery);

    if (!jobMarkDeleiveryAddedResponse) {
      console.error("Error while adding job to BullMQ for markDelivering");
      return res.status(500).json({
        type: "error",
        message: "Error while adding job - markDelivering - to BullMQ",
      });
    }

    // Add -markCompleted- job to bullmq
    const service = await Service.findById(appointmentUpdateResponse?.service);
    const serviceTimeMs = service.serviceTime.getTime();
    const delay2 = Math.max(appointmentTimeMs+serviceTimeMs - Date.now(), 0);


    // Add -markDeleivery- job to BullMQ
    const jobInfoMarkCompleted = {
      name: "markCompleted",
      data: {
        appointmentId: appointmentUpdateResponse._id
      },
      delay: delay2 
    };
    const jobMarkCompletedAddedResponse = await addJobToBullmq(jobInfoMarkCompleted);

    if(!jobMarkCompletedAddedResponse) {
      console.error("Error while adding job to BullMQ for markCompleted");
      return res.status(500).json({
        type: "error",
        message: "Error while adding job - markCompleted - to BullMQ",
      });
    }

    // add reminders job to bullmq

    const delay3 = Math.max(appointmentTimeMs+serviceTimeMs - Date.now()-5000*60, 0);

    const jobInfoReminders = {
      name: "reminders",
      data: {
        appointmentId: appointmentUpdateResponse._id
      },
      delay: delay3
    };

    console.log(`✅ Payment succeeded for appointment ${appointmentId}`);

    return res.status(200).json({
      type: "success",
      message: `Payment succeeded for appointment ${appointmentId}`,
    });
  } catch (updateErr) {
    console.error(`Failed to update appointment ${appointmentId}:`, updateErr);
    return res.status(500).json({
      type: "error",
      message: "Internal server error while processing Stripe webhook.",
    });
  }
};



// { APPOINTMENT REFUND ROUTE }
export const refundAppointmentPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        type: 'error',
        message: 'Missing appointmentId',
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        type: 'error',
        message: 'Appointment not found',
      });
    }

    if (!appointment.paymentIntentId) {
      return res.status(400).json({
        type: 'error',
        message: 'Appointment does not have a paymentIntentId',
      });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.paymentIntentId,
      // amount omitted → refund full amount
    });

    appointment.paymentStatus = 'refunded';
    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      type: 'success',
      message: 'Full refund processed successfully',
      refund,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      type: 'error',
      message: error.message,
    });
  }
};


// { APPOINTMENT PARTIAL REFUND ROUTE }
export const partialRefundAppointmentPayment = async (req, res) => {
  try {
    const { appointmentId, refundAmount } = req.body;

    if (!appointmentId || refundAmount == null) {
      return res.status(400).json({
        type: 'error',
        message: 'Missing appointmentId or refundAmount',
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        type: 'error',
        message: 'Appointment not found',
      });
    }

    if (!appointment.paymentIntentId) {
      return res.status(400).json({
        type: 'error',
        message: 'Appointment does not have a paymentIntentId',
      });
    }

    if (refundAmount > appointment.amountPaid) {
      return res.status(400).json({
        type: 'error',
        message: 'Refund amount exceeds amount paid',
      });
    }

    // Create partial refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.paymentIntentId,
      amount: refundAmount, // in cents
    });

    // Update appointment
    appointment.paymentStatus =
      refundAmount === appointment.amountPaid
        ? 'refunded'
        : 'partial_refund';
    await appointment.save();

    res.status(200).json({
      type: 'success',
      message: 'Partial refund processed successfully',
      refund,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      type: 'error',
      message: error.message,
    });
  }
};




// { APPOINTMENT REVIEW AND RATING ROUTE }