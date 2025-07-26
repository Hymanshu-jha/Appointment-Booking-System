import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async () => {
    try {
       await mongoose.connect(MONGO_URL); 
       console.log('✅ MongoDB connected');
    } catch (error) {
        console.log('error while  connecting to mongodb', error);
        process.exit(1);
    }
}