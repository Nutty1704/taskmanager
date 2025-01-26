import express from 'express'

import { createBoard, deleteBoard, getBoards } from '../controllers/board.controller.js'


const router = express.Router();

router.post('/create', createBoard);
router.delete('/delete', deleteBoard);
router.get('/', getBoards);

export default router;