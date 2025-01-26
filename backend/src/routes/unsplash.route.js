import express from 'express';
import { getRandomImages } from '../controllers/unsplash.controller.js';

const router = express.Router();

router.post('/random', getRandomImages);

export default router;