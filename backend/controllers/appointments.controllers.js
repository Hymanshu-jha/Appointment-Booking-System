import Stripe from 'stripe';
import mongoose from 'mongoose';
import Appointment from '../db/schema/appointments.models.js';
import Service from '../db/schema/services.models.js';
import { addJobToBullmq } from '../utils/bullmq/producer.bullmq.js';



const VITE_BASE_URL = process.env.VITE_BASE_URL;


// Helper to convert minutes back to time string e.g. "11:30 am"
function minutesToTimeString(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  const meridian = h >= 12 ? 'pm' : 'am';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, '0')} ${meridian}`;
}

export const getFreeSlots = async (req, res) => {
  try {
    // Extract variables from query string
    const { serviceId, date } = req.query;

    console.log("Service ID from query:", serviceId);
    console.log("Date from query:", date);

    if (!serviceId) {
      return res.status(400).json({ success: false, message: "Service ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid serviceId" });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    const dayStart = new Date(date);
    if (isNaN(dayStart.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // fetch the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // now look at the working hours and service time of the service
    const workingHours = service.workingHours;
    const serviceTime = service.serviceTime;
    const freeSlots = [];

    // fetch appointments on that date for that service
    const appointments = await Appointment.find({
      service: serviceId,
      appointmentDate: { 
        $gte: dayStart,
        $lt: dayEnd
      }
    });

    // store all appointments' time into a bookedSlotsArray
    const bookedSlotsArray = appointments.map((appointment) => {
      const appointmentTime = appointment.appointmentTime;

      // Parse start time
      const [startTime, startMeridianRaw] = appointmentTime.start.toLowerCase().split(' ');
      const startMeridian = startMeridianRaw.toLowerCase();
      const [startHourStr, startMinuteStr] = startTime.split(':');
      let startHour = Number(startHourStr);
      const startMinute = Number(startMinuteStr);
      if (startMeridian === 'pm' && startHour !== 12) startHour += 12;
      if (startMeridian === 'am' && startHour === 12) startHour = 0;
      const start = startHour * 60 + startMinute;

      // Parse end time
      const [endTime, endMeridianRaw] = appointmentTime.end.toLowerCase().split(' ');
      const endMeridian = endMeridianRaw.toLowerCase();
      const [endHourStr, endMinuteStr] = endTime.split(':');
      let endHour = Number(endHourStr);
      const endMinute = Number(endMinuteStr);
      if (endMeridian === 'pm' && endHour !== 12) endHour += 12;
      if (endMeridian === 'am' && endHour === 12) endHour = 0;
      const end = endHour * 60 + endMinute;

      return { start, end };
    });

    // Sort booked slots by start time
    bookedSlotsArray.sort((a, b) => a.start - b.start);

    let bookedIndex = 0; // pointer to current booked slot

    // Iterate over working hours in serviceTime chunks
    for (
      let slotStart = Number(workingHours.start) * 60;
      slotStart + serviceTime <= Number(workingHours.end) * 60;
      slotStart += serviceTime
    ) {
      const slotEnd = slotStart + serviceTime;

      // advance bookedIndex while current booked slot ends before slotStart
      while (
        bookedIndex < bookedSlotsArray.length &&
        bookedSlotsArray[bookedIndex].end <= slotStart
      ) {
        bookedIndex++;
      }

      // if bookedIndex out of bounds or no overlap with current booked slot, this slot is free
      if (
        bookedIndex === bookedSlotsArray.length ||
        bookedSlotsArray[bookedIndex].start >= slotEnd
      ) {
        freeSlots.push({
          start: minutesToTimeString(slotStart),
          end: minutesToTimeString(slotEnd),
        });
      }
    }

    return res.status(200).json({
      slots: freeSlots,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching free slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Error while fetching free slots',
    });
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
      success_url: `${VITE_BASE_URL}/appointments`,
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