import Board from "../models/board.model.js";
import Card from "../models/card.model.js";
import List from "../models/list.model.js";
import AuditLog, { auditLogActions, auditLogEntityTypes } from "../models/audit-log.model.js";
import { NotFoundError, UnauthorizedError } from "./error-util.js";
import { clerkClient } from "@clerk/express"
import labelColors from '../config/labelColors.json' with { type: 'json' };
import Label from "../models/label.model.js";


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


export const createAuditLog = async (entityType, action, entityId, entityTitle, orgId, userId) => {
    if (!auditLogEntityTypes.includes(entityType)) {
        throw new Error("Invalid entity type");
    }

    if (!auditLogActions.includes(action)) {
        throw new Error("Invalid action");
    }

    try {
        const user = await clerkClient.users.getUser(userId);

        if (!user) {
            throw new Error("Invalid user id");
        }

        const auditLog = new AuditLog({
            entityType,
            action,
            entityId,
            entityTitle,
            orgId,
            userId
        });

        await auditLog.save();

    } catch (error) {
        console.log("Error in createAuditLog", error);
        throw error;
    }
}


export const attachUserToLogs = async (logs) => {
    try {
        if (!logs.length) return;

        logs.forEach((log, index) => {
            logs[index] = log.toObject()
        });

        const userIds = [... new Set(logs.map(log => log.userId))];

        const users = await fetchUsersFromClerk(userIds);

        const userMap = new Map(users.map(user => [user.id, user]));

        logs.forEach(log => {
            const user = userMap.get(log.userId) || null;
            log.userName = user.firstName + " " + user.lastName;
            log.userImage = user.imageUrl;

        });

    } catch (error) {
        console.log("Error in attachUserToLogs", error);
        throw error;
    }
}

// Function to batch-fetch users from Clerk API
const fetchUsersFromClerk = async (userIds) => {
    try {
        if (userIds.length === 0) return [];

        const users = await clerkClient.users.getUserList({
            userId: userIds
        });

        return users.data;
    } catch (error) {
        console.error("Error fetching users from Clerk:", error);
        return [];
    }
};


export const isValidColor = (color) => {
    return Object.hasOwn(labelColors, `${color}`);
}

const getIdByColor = (hex) => {
    // Loop through the colors object and find the key for the given hex value
    for (const key in colors) {
        if (colors[key].hex === hex) {
            return key; // Return the ID (key) corresponding to the hex value
        }
    }
    return null; // Return null if the hex value doesn't exist
};

const getColorByKey = (key) => {
    const colorData = colors[key];
    if (colorData) {
        return colorData;
    }
    return null; // If key doesn't exist
};


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


export const getCardLabels = async (boardId, cardId) => {
    try {
        const labels = await Label.find({ boardId, cardId });
        return labels;
    } catch (error) {
        console.log("Error in getCardLabels", error);
        throw error;
    }
}