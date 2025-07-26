import { Worker } from 'bullmq';
import Redis from 'ioredis';
import sendVerificationMail from './utils/nodemailer/transporter.nodemailer.js';
import dotenv from 'dotenv';
import Appointment from './db/schema/appointments.models.js';

dotenv.config();

// Redis connection
const REDIS_TOKEN = process.env.REDIS_TOKEN;
const connection = new Redis(`rediss://default:${REDIS_TOKEN}@tender-chipmunk-14111.upstash.io:6379`, {
  maxRetriesPerRequest: null
});

// Create worker
const worker = new Worker(
  'appointmentbooking',
  async (job) => {
    console.log(`Processing job: ${job.name}`);

    switch (job.name) {
      case 'verifyEmail': {
        const { to, token, username } = job.data;
        await sendVerificationMail({ to, token, username });
        console.log('Verification mail sent from worker.');
        break;
      }

      case 'markDeleivering': {
        const { appointmentId } = job.data;
        console.log(`Marking appointment ${appointmentId} as delivering.`);

        const appointmentExists = await Appointment.findById(appointmentId);

        if(!appointmentExists || appointmentExists.status !== 'scheduled') {
          return false;
        }

        await appointmentExists.updateOne({ status: 'deleivering' });

        break;
      }

      case 'markCompleted': {
        const { appointmentId } = job.data;
        console.log(`Marking appointment ${appointmentId} as completed.`);

        const appointmentExists = await Appointment.findById(appointmentId);

        if(!appointmentExists || appointmentExists.status !== 'scheduled') {
          return false;
        }

        await appointmentExists.updateOne({ status: 'completed' });

        break;
      }

      case 'reminders': {
        // const { appointmentId } = job.data;
        // console.log(`Reminder: appointment ${appointmentId} will complete in ${timeBefore} minutes.`);

        // Example:
        // You could send a push notification here.
        // io.emit('appointmentReminder', {
        //   appointmentId,
        //   message: `Your session will end in ${timeBefore} minutes!`
        // });

        break;
      }

      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: 5
  }
);

// Worker events
worker.on('completed', (job) => {
  console.log(`Job ${job.id} (${job.name}) has completed.`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
});
