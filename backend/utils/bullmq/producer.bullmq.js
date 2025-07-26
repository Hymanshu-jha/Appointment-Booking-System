import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_TOKEN = process.env.REDIS_TOKEN;
console.log('connection initiated in bullmq producer');
const connection = new Redis(`rediss://default:${REDIS_TOKEN}@tender-chipmunk-14111.upstash.io:6379`);
console.log('connected to cloud redis from upstash');
const emailQueue = new Queue('appointmentbooking', { connection });


export async function addJobToBullmq(jobInfo) {
  if (!jobInfo) {
    throw new Error('Missing required parameters');
  }

  let retValue = false;

  const { data, delay, name } = jobInfo;

  console.log('add queue invoked');

  switch(name) {
    case ('verifyEmail'):
      {
          const qAddResponse = await emailQueue.add(
            'verifyEmail', 
             data, { delay, attempts: 2}
            );
          if(!qAddResponse) {
           console.log('could not add -verify Email- to the queue');
           return false;
          } 

          console.log(`Verification email job added`);
          retValue = true;
          break;
    }

    case ('markDeleivering'): {
      const qAddResponse = await emailQueue.add(
        'markDeleivering', 
        data, { delay, attempts: 2}
      );
          if(!qAddResponse) {
           console.log('could not add -mark deleivering- to the queue');
           return false;
          } 

          console.log(`mark deleivering appointment job added`);
          retValue = true;
          break;
    }

    case ('markCompleted'): {
      const qAddResponse = await emailQueue.add(
        'markCompleted',
         data, { delay, attempts: 2}
        );
          if(!qAddResponse) {
           console.log('could not add -mark completed- to the queue');
           return false;
          } 

          console.log(`mark completed appointment job added`);
          retValue = true;
          break;
    }

    // reminding both client and provider 5, 2, 1 minutes before session ends
    case ('reminders'): {
      const qAddResponse = await emailQueue.add(
        'reminders',
         data, { delay, attempts: 2}
        );
          if(!qAddResponse) {
           console.log('could not add job -reminders- to the bullmq');
           return false;
          } 

          console.log(`-reminders- job for appointment added to bullmq`);
          retValue = true;
          break;
    }
     default: {
      console.log(`no case matched in bullmq producer`);
      retValue = false;
     }
    
  }

  return retValue;
  
}


