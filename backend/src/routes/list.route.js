import express from "express";
import {
    getBoardLists, createList,
    updateList, deleteList,
    copyList
} from '../controllers/list.controller.js'

const router = express.Router();

router.get('/:boardId', getBoardLists);
router.post('/:boardId/create', createList);
router.post('/:boardId/update', updateList);
router.post('/:boardId/delete', deleteList);
router.post('/:boardId/copy', copyList);

export default router;