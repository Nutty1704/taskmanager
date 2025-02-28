import Board from '../models/board.model.js'
import Label from '../models/label.model.js';

import { InvalidDataError, UnauthorizedError } from '../lib/error-util.js';
import { isValidColor } from '../lib/label-util.js';
import { createDefaultLabels, verifyOrgForBoard } from '../lib/board-util.js';
import { createAuditLog } from '../lib/audit-util.js';
import { addToHistory } from '../lib/user-util.js';

export const createBoard = async (req, res, next) => {
    try {
        const {
            title,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        } = req.body;

        const { orgId, userId } = req.auth;

        if (!title || !imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
            throw new InvalidDataError("All fields are required");
        }

        const newBoard = new Board({
            title,
            orgId,
            imageId,
            imageThumbUrl,
            imageFullUrl,
            imageLinkHTML,
            imageUserName
        });

        await createDefaultLabels(newBoard._id);
        await newBoard.save();

        await createAuditLog("board", "create", newBoard._id, newBoard.title, orgId, userId);

        res.status(201).json({ success: true, data: newBoard });

    } catch (error) {
        next(error);
    }
}


export const deleteBoard = async (req, res, next) => {
    try {
        const { id } = req.body;
        const { orgId, userId } = req.auth;

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

        await Board.findByIdAndDelete(id);

        await Label.deleteMany({ boardId: id });

        await createAuditLog("board", "delete", board._id, board.title, orgId, userId);

        res.status(200).json({ success: true, message: "Board deleted successfully" });

    } catch (error) {
        next(error);
    }
}


export const getBoards = async (req, res, next) => {
    try {
        const { orgId } = req.auth;

        const boards = await Board.find({ orgId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: boards });
    } catch (error) {
        next(error);
    }
}


export const getBoard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.params;

        const board = await Board.findOne({ _id: boardId, orgId });

        if (!board) {
            throw new NotFoundError("Board not found");
        }

        await addToHistory(userId, orgId, board._id);

        res.status(200).json({ success: true, data: board });
    } catch (error) {
        next(error);
    }
}


export const updateBoard = async (req, res, next) => {
    try {
        const { id, title, isStarred } = req.body;
        const { orgId, userId } = req.auth;

        if (!id) {
            throw new InvalidDataError("Board id is required");
        }

        if (!title && isStarred === undefined) {
            throw new InvalidDataError("At least one field is required");
        }

        const board = await Board.findById(id);

        if (!board) {
            throw new NotFoundError("Board not found");
        }

        if (board.orgId.toString() !== orgId) {
            throw new UnauthorizedError("Unauthorized");
        }

        if (title) board.title = title;
        if (isStarred !== undefined) board.isStarred = isStarred;

        await board.save();

        if (title) {
            await createAuditLog("board", "update", board._id, board.title, orgId, userId);
        }

        res.status(200).json({ success: true, data: board });
    } catch (error) {
        next(error);
    }
}


export const getBoardLabels = async (req, res, next) => {
    try {
        const { boardId } = req.params;

        if (!boardId) throw new InvalidDataError("Board id is required");

        const labels = await Label.find({ boardId });
        
        res.status(200).json({ success: true, data: labels });
    } catch (error) {
        next(error);
    }
}


export const updateBoardLabel = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId } = req.params;
        const { labelId: id, title, color } = req.body;

        if (!boardId) throw new InvalidDataError("Board id is required");
        if (!(isValidColor(color))) throw new InvalidDataError("Invalid color");

        const boardExists = await Board.exists({ _id: boardId, orgId });

        if (!boardExists) throw new NotFoundError("Board not found");

        const label = id ? await Label.findById(id) : null;

        if (!label) {
            const newLabel = await Label.create({
                title,
                color,
                boardId
            });

            return res.status(201).json({ success: true, data: newLabel });
        }

        if (label.boardId.toString() !== boardId) throw new UnauthorizedError("Unauthorized");

        label.title = title;
        label.color = color;

        await label.save();

        return res.status(200).json({ success: true, data: label });

    } catch (error) {
        next(error);
    }
}


export const deleteBoardLabel = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        const { boardId, labelId } = req.params;

        await verifyOrgForBoard(orgId, boardId);

        const label = await Label.findOneAndDelete({ _id: labelId, boardId });

        if (!label) throw new NotFoundError("Label not found");

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}