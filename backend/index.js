import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

import { Server } from "socket.io";

import { connectDB } from './db/connection/MongoConnection.js';
import userRouter from './routes/users.routes.js';
import OAuth2Router from './routes/oauth2.0.routes.js';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import storeRouter from './routes/stores.routes.js';
import serviceRouter from './routes/services.routes.js';
import appointmentRouter from './routes/appointments.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://appointment-booking-system-three.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


// Express CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://appointment-booking-system-three.vercel.app'
  ],
  credentials: true,
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'session_secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/oauth', OAuth2Router);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/appointment', appointmentRouter);


app.get('/', (req, res) => {
  res.send('Welcome to the Appointment Booking System API');
});

await connectDB();

// socket.io connection
io.on("connection", (socket) => {
  socket.on("message", (data) => {
    console.log("Server received:", data);
    socket.send('dsfnkdn');
  });
  
});

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

