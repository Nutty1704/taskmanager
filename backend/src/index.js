import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import { connectDB } from './lib/db.js'

import boardRouter from './routes/board.route.js'
import unsplashRouter from './routes/unsplash.route.js'
import { isAuthenticated } from './middlewares/auth.middleware.js'

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/board', isAuthenticated, boardRouter);
app.use('/api/unsplash', isAuthenticated, unsplashRouter);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})