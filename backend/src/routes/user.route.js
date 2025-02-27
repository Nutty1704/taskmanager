import express from 'express';
import { getStarredBoards, starBoard, unstarBoard } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/star-board', starBoard);
router.post('/unstar-board', unstarBoard);
router.get('/starred-boards', getStarredBoards);

export default router;