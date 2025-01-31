import Board from "../models/board.model.js";
import Card from "../models/card.model.js";
import List from "../models/list.model.js";
import { NotFoundError, UnauthorizedError } from "./error-util.js";


export const getId = (id) => {
}

export const verifyOrgForBoard = async (orgId, boardId) => {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new NotFoundError("Board not found");
        } else if (board.orgId.toString() !== orgId) {
            throw new UnauthorizedError("Unauthorized");
        }
        return true;
    } catch (error) {
        console.log("Error in verifyOrgForBoard", error);
        throw error;
    }
}

export const safeGetList = async (orgId, boardId, listId) => {
    await verifyOrgForBoard(orgId, boardId);
    const list = await List.findById(listId);

    if (!list) {
        throw new NotFoundError("List not found");
    } else if (list.board_id.toString() !== boardId) {
        throw new UnauthorizedError("Unauthorized");
    }

    return list;
}


export const getHighestOrderList = async (boardId) => {
    try {
        const board = await List.find({ board_id: boardId })
            .select("position")
            .sort({ position: -1 })
            .limit(1);

        return board.length ? board[0].position : 0;
    } catch (error) {
        console.log("Error in getHighestOrderList", error)
        return 0;
    }
}


export const verifyCardPermission = async (orgId, boardId, listId) => {
    try {
        await verifyOrgForBoard(orgId, boardId);

        const list = await List.findById(listId);

        if (!list) {
            throw new NotFoundError("List not found");
        }

        if (list.board_id.toString() !== boardId) {
            throw new UnauthorizedError("Unauthorized");
        }

        return true;
    } catch (error) {
        console.log("Error in verifyCardPermission", error);
        throw error;
    }
}


export const getHighestOrderCard = async (listId) => {
    try {
        const list = await Card.find({ list_id: listId })
            .select("position")
            .sort({ position: -1 })
            .limit(1);

        return list.length ? list[0].position : 0;
    } catch (error) {
        console.log("Error in getHighestOrderCard", error);
        throw error;
    }
}
