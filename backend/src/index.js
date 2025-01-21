import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectDB } from './lib/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
})