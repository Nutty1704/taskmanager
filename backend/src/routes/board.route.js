import express from 'express'

import { createBoard, deleteBoard, getBoards, getBoard, updateBoard } from '../controllers/board.controller.js'


const router = express.Router();

router.post('/create', createBoard);
router.post('/delete', deleteBoard);
router.get('/', getBoards);
router.get('/:boardId', getBoard);
router.post('/update', updateBoard);

export default router;