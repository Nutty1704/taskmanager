import express from 'express';
import {
    createCard, moveCard,
    getCard, updateCard,
    copyCard, deleteCard,
    getCardAuditLog
} from '../controllers/card.controller.js';

const router = express.Router();


router.post('/create', createCard);
router.post('/move', moveCard);
router.post('/get', getCard);
router.post('/update', updateCard);
router.post('/copy', copyCard);
router.post('/delete', deleteCard);
router.get('/:cardId/logs', getCardAuditLog);

export default router;