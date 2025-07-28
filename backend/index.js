import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import MongoStore from 'connect-mongo';

import { connectDB } from './db/connection/MongoConnection.js';
import userRouter from './routes/users.routes.js';
import OAuth2Router from './routes/oauth2.0.routes.js';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import storeRouter from './routes/stores.routes.js';
import serviceRouter from './routes/services.routes.js';
import appointmentRouter from './routes/appointments.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    const app = express();
    const server = http.createServer(app);

    // Allow frontend URLs
    const allowedOrigins = [
      'http://localhost:5173',
      'https://appointment-booking-system-tau.vercel.app',
    ];

    // Trust reverse proxy (Render)
    app.set('trust proxy', 1);

    // Enable CORS
    app.use(cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }));

    app.use(express.json());
    app.use(cookieParser());

    // Connect to DB before session store
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // SESSION SETUP with MongoDB store
    app.use(session({
      name: 'oauth-session',
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'None', // ← required for cross-site cookies
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    }));

    // Socket.io
    const io = new Server(server, {
      cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Log all requests
    app.use((req, res, next) => {
      console.log(`[${req.method}] ${req.originalUrl}`);
      next();
    });

    // Routes
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/oauth', OAuth2Router);
    app.use('/api/v1/store', storeRouter);
    app.use('/api/v1/service', serviceRouter);
    app.use('/api/v1/appointment', appointmentRouter);

    // Welcome Route
    app.get('/', (req, res) => {
      res.send('Welcome to the Appointment Booking System API');
    });

    // Optional: test session
    app.get('/test-session', (req, res) => {
      req.session.views = (req.session.views || 0) + 1;
      res.send(`Session viewed ${req.session.views} times`);
    });

    // Socket events
    io.on("connection", (socket) => {
      socket.on("message", (data) => {
        console.log("Server received:", data);
        socket.send('dsfnkdn');
      });
    });

    // Error handler
    app.use(errorHandler);

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(error.stack);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Error handlers
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();
