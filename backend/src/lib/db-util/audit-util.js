import { fetchUsersFromClerk, getName } from "../clerk-util.js";

import AuditLog, { auditLogActions, auditLogEntityTypes } from "../../models/audit-log.model.js";

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
            log.userName = getName(user);
            log.userImage = user.imageUrl;
        });

    } catch (error) {
        if (!error.isCustom) {
            console.log("Error in attachUserToLogs", error);
        }
        throw error;
    }
}

/**
 * Creates a new audit log in the database.
 * @param {string} entityType One of `board`, `list`, or `card`.
 * @param {string} action One of `create`, `update`, or `delete`.
 * @param {string} entityId The ID of the entity being audited.
 * @param {string} entityTitle A human-readable title for the entity being audited.
 * @param {string} orgId The ID of the org the audit log belongs to.
 * @param {string} userId The ID of the user making the action.
 * @throws {Error} If the entity type or action is invalid.
 * @throws {Error} If the user ID is invalid.
 * @returns {Promise<void>}
 */
export const createAuditLog = async (entityType, action, entityId, entityTitle, orgId, userId) => {
    if (!auditLogEntityTypes.includes(entityType)) {
        throw new Error("Invalid entity type");
    }

    if (!auditLogActions.includes(action)) {
        throw new Error("Invalid action");
    }

    try {
        const user = (await fetchUsersFromClerk([userId]))[0];

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
        if (!error.isCustom) {
            console.log("Error in createAuditLog", error);
        }
        throw error;
    }
}