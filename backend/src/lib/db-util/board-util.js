import Board from "../../models/board.model.js";
import Label from "../../models/label.model.js";

import { NotFoundError, UnauthorizedError } from "../error-util.js";

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


export const createDefaultLabels = async (boardId) => {
    try {
        const defaultColors = [6, 7, 8, 9, 10];

        const labels = await Promise.all(
            defaultColors.map(async (color) => {
                const label = await Label.create({
                    color,
                    boardId
                });
                return label._id
            })
        );

        return labels;
    } catch (error) {
        console.log("Error in createDefaultLabels", error);
        throw error;
    }
}