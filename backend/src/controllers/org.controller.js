import { attachUserToLogs } from "../lib/audit-util.js";
import AuditLog from "../models/audit-log.model.js";

export const getAuditLogs = async (req, res, next) => {
    try {
        const { orgId } = req.auth;

        const logs = await AuditLog.find({ orgId }).sort({ createdAt: -1 });

        await attachUserToLogs(logs);

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        next(error);
    }
}