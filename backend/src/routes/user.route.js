import express from 'express';
import { getRecentBoards, getStarredBoards,
    starBoard, unstarBoard } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/star-board', starBoard);
router.post('/unstar-board', unstarBoard);
router.get('/starred-boards', getStarredBoards);
router.get('/recent-boards', getRecentBoards);

export default router;