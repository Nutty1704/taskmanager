import express from "express";
import {
    getBoardLists, createList,
    updateList, deleteList,
    copyList, updateListPositions
} from '../controllers/list.controller.js'

const router = express.Router();

router.get('/:boardId', getBoardLists);
router.post('/:boardId/create', createList);
router.post('/:boardId/update', updateList);
router.post('/:boardId/delete', deleteList);
router.post('/:boardId/copy', copyList);
router.post('/:boardId/positions', updateListPositions);

export default router;