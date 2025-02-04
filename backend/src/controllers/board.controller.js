import Board from '../models/board.model.js'
import { InvalidDataError, UnauthorizedError } from '../lib/error-util.js';
import { createAuditLog } from '../lib/db-util.js';

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
        const { orgId } = req.auth;
        const { boardId } = req.params;

        const board = await Board.findOne({ _id: boardId, orgId });

        if (!board) {
            throw new NotFoundError("Board not found");
        }

        res.status(200).json({ success: true, data: board });
    } catch (error) {
        console.log("Error in getBoard controller", error);
        res.status(500).json({ success: false, message: "Internal server error" });
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