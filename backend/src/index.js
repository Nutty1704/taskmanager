import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { clerkMiddleware } from '@clerk/express';

import { connectDB } from './lib/db.js';
import { initializeSocket } from './lib/socket.js'; // Import socket setup

import boardRouter from './routes/board.route.js';
import checkpointRouter from './routes/checkpoint.route.js';
import listRouter from './routes/list.route.js';
import cardRouter from './routes/card.route.js';
import orgRouter from './routes/org.route.js';
import userRouter from './routes/user.route.js';
import unsplashRouter from './routes/unsplash.route.js';

import { isAuthenticated } from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error-handler.middleware.js';

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express();
const server = createServer(app);

app.use(cors({
    origin: [process.env.FRONTEND_URL],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
        clockSkewInMs: 15 * 1000, // 15 seconds
        authorizedParties: [process.env.FRONTEND_URL],
    }));

// Socket setup
initializeSocket(server);

// Routes
app.use('/api/board', isAuthenticated, boardRouter);
app.use('/api/checkpoint', isAuthenticated, checkpointRouter);
app.use('/api/list', isAuthenticated, listRouter);
app.use('/api/card', isAuthenticated, cardRouter);
app.use('/api/org', isAuthenticated, orgRouter);
app.use('/api/user', isAuthenticated, userRouter);
app.use('/api/unsplash', isAuthenticated, unsplashRouter);


// Error handler
app.use(errorHandler);

server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})