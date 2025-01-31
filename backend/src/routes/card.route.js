import express from 'express';
import { createCard, moveCard, getCard, updateCard } from '../controllers/card.controller.js';

const router = express.Router();


router.post('/create', createCard);
router.post('/move', moveCard);
router.post('/get', getCard);
router.post('/update', updateCard);

export default router;