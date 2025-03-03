import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import { connectDB } from './lib/db.js'

import boardRouter from './routes/board.route.js'
import listRouter from './routes/list.route.js'
import cardRouter from './routes/card.route.js'
import orgRouter from './routes/org.route.js'
import userRouter from './routes/user.route.js'
import unsplashRouter from './routes/unsplash.route.js'

import { isAuthenticated } from './middlewares/auth.middleware.js'
import errorHandler from './middlewares/error-handler.middleware.js'

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware({
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        secretKey: process.env.CLERK_SECRET_KEY,
        clockSkewInMs: 15 * 1000, // 15 seconds
        authorizedParties: ['http://localhost:5173'],
    }));

// Routes
app.use('/api/board', isAuthenticated, boardRouter);
app.use('/api/list', isAuthenticated, listRouter);
app.use('/api/card', isAuthenticated, cardRouter);
app.use('/api/org', isAuthenticated, orgRouter);
app.use('/api/user', isAuthenticated, userRouter);
app.use('/api/unsplash', isAuthenticated, unsplashRouter);


// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})