import { InvalidDataError } from '../lib/error-util.js'
import { verifyOrgForBoard } from '../lib/board-util.js'
import { safeGetUser } from "../lib/user-util.js";

export const getRecentBoards = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;

        const user = await safeGetUser(userId, orgId);

        res.status(200).json({ success: true, data: user.recentBoards || [] });
    } catch (error) {
        next(error);
    }
}

export const getStarredBoards = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;

        const user = await safeGetUser(userId, orgId); 

        res.status(200).json({ success: true, data: user.starredBoards || [] });
    } catch (error) {
       next(error); 
    }
}

export const starBoard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.body;

        if (!boardId) {
            throw new InvalidDataError("Board id is required");
        }

        await verifyOrgForBoard(orgId, boardId);

        const user = await safeGetUser(userId, orgId);

        if (!user.starredBoards?.includes(boardId)) {
            user.starredBoards.push(boardId);
            await user.save();
        }

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}

export const unstarBoard = async (req, res, next) => {
    try {
        const { orgId, userId } = req.auth;
        const { boardId } = req.body;

        if (!boardId) {
            throw new InvalidDataError("Board id is required");
        }

        await verifyOrgForBoard(orgId, boardId);

        const user = await safeGetUser(userId, orgId);

        user.starredBoards = user.starredBoards.filter(id => String(id) !== String(boardId));
        await user.save();

        res.status(200).json({ success: true });
    } catch (error) {
        next(error);
    }
}