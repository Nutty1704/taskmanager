import express from "express";
import { createCheckpoint, deleteCheckpoint, getCheckpoint } from "../controllers/checkpoint.controller.js";

const router = express.Router();

router.get('/', getCheckpoint);
router.post('/', createCheckpoint);
router.delete('/:id', deleteCheckpoint);

export default router;