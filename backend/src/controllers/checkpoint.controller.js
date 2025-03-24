import { fetchListsWithCards, populateLists } from '../lib/db-util/list-util.js';
import Checkpoint from '../models/checkpoint.model.js';
import Board from '../models/board.model.js';
import { InvalidDataError, NotFoundError, UnauthorizedError } from '../lib/error-util.js';

import { getIO } from "../lib/socket.js";

export const createCheckpoint = async (req, res, next) => {
    try {
        const { id } = req.body;
        const { orgId } = req.auth;

        if (!id) {
            throw new InvalidDataError("Board id is required");
        }

        const board = await Board.findById(id);

        if (!board) {
            throw new NotFoundError("Board not found");
        }

        if (board.orgId.toString() !== orgId) {
            throw new UnauthorizedError("Unauthorized");
        }

        let lists = await fetchListsWithCards(id);
        lists = await populateLists(lists);

        const snapshot = {
            title: board.title,
            imageId: board.imageId,
            imageThumbUrl: board.imageThumbUrl,
            imageFullUrl: board.imageFullUrl,
            imageUserName: board.imageUserName,
            imageLinkHTML: board.imageLinkHTML,
            lists
        }

        const newCheckpoint = new Checkpoint({
            boardId: id,
            snapshot
        });

        await newCheckpoint.save();

        if (board.checkpoints.length >= 5) {
            const oldestCheckpoint = board.checkpoints.pop();
            await Checkpoint.findByIdAndDelete(oldestCheckpoint.checkpointId);
        }

        board.checkpoints.unshift({ checkpointId: newCheckpoint._id, createdAt: new Date() });
        await board.save();

        // Emit event
        getIO().to(id).emit('checkpointUpdated', { checkpoints: board.checkpoints });

        res.status(200).json({ success: true, data: newCheckpoint });

    } catch (error) {
        console.log("Error creating checkpoint", error);
        next(error);
    }
}

export const deleteCheckpoint = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { orgId } = req.auth;

        if (!id) {
            throw new InvalidDataError("Checkpoint id is required");
        }

        const checkpoint = await Checkpoint.findById(id);

        if (!checkpoint) {
            throw new NotFoundError("Checkpoint not found");
        }

        const board = await Board.findOne({ _id: checkpoint.boardId, orgId });

        if (!board) {
            throw new UnauthorizedError("Access to checkpoint denied");
        }

        await Checkpoint.findByIdAndDelete(id);

        console.log("Before delete", board.checkpoints);

        board.checkpoints = board.checkpoints.filter(checkpoint => checkpoint.checkpointId.toString() !== id);
        await board.save();

        console.log("After delete", board.checkpoints);

        // Emit event
        getIO().to(board._id.toString()).emit('checkpointUpdated', { checkpoints: board.checkpoints });

        res.status(200).json({ success: true, message: "Checkpoint deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export const getCheckpoint = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { checkpointId } = req.query;

        if (!checkpointId) {
            throw new InvalidDataError("Missing query parameter: checkpointId");
        }

        const checkpoint = await Checkpoint.findById(checkpointId);

        if (!checkpoint) {
            throw new NotFoundError("Checkpoint not found");
        }

        const board = await Board.findOne({ _id: checkpoint.boardId, orgId });

        if (!board) {
            throw new UnauthorizedError("Access to checkpoint denied");
        }

        res.status(200).json({ success: true, data: checkpoint });
    } catch (error) {
        next(error);
    }
}