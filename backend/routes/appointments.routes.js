import express from 'express';
import bodyParser from "body-parser";
import { 
    createPaymentController,
    getFreeSlots,
    StripeWebhookController 
} from '../controllers/appointments.controllers.js'
import dotenv from 'dotenv';
import authorize from '../middlewares/authorize.middlewares.js';
dotenv.config({
  path: process.env.NODE_ENV === "production" 
    ? ".env.production" 
    : ".env.local"
});
const appointmentRouter = express.Router();

appointmentRouter.get('/getfreeslots', getFreeSlots);
appointmentRouter.post('/stripepaymentintent',  authorize, createPaymentController);
appointmentRouter.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  StripeWebhookController
);


export default appointmentRouter;