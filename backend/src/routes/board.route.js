import express from 'express'

import {
    createBoard, deleteBoard,
    getBoards, getBoard,
    updateBoard, getBoardLabels,
    updateBoardLabel, deleteBoardLabel
} from '../controllers/board.controller.js'


const router = express.Router();

router.post('/create', createBoard);
router.post('/delete', deleteBoard);
router.get('/', getBoards);
router.get('/:boardId', getBoard);
router.post('/update', updateBoard);
router.get('/:boardId/labels', getBoardLabels);
router.put('/:boardId/label', updateBoardLabel);
router.delete('/:boardId/label/:labelId', deleteBoardLabel);

export default router;