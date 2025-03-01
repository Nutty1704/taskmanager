import express from 'express';
import {
    createCard, moveCard,
    getCard, updateCard,
    copyCard, deleteCard,
    getCardAuditLog, modifyCardLabel,
    updateAssignees
} from '../controllers/card.controller.js';
import { addItem, createChecklist, deleteItem, getChecklists, removeChecklist, updateChecklist, updateItem } from '../controllers/checklist.controller.js';

import { isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/create', createCard);
router.post('/move', moveCard);
router.post('/get', getCard);
router.post('/update', updateCard);
router.post('/copy', copyCard);
router.post('/delete', deleteCard);
router.get('/:cardId/logs', getCardAuditLog);
router.post('/modify-label', modifyCardLabel);
router.post('/update-assignees', isAdmin, updateAssignees);

// Checklist routes
router.post('/checklist/create', createChecklist);
router.post('/checklist/add-item', addItem);
router.post('/checklist/update-item', updateItem);
router.post('/checklist/delete-item', deleteItem);
router.post('/checklist/remove', removeChecklist);
router.get('/:cardId/checklists', getChecklists);
router.post('/checklist/update', updateChecklist);

export default router;