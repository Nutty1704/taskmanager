import { attachUserToLogs } from "../lib/audit-util.js";
import AuditLog from "../models/audit-log.model.js";

export const getAuditLogs = async (req, res, next) => {
    try {
        const { orgId } = req.auth;
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        const skip = (page - 1) * limit;

        const totalLogs = await AuditLog.countDocuments({ orgId });

        const logs = await AuditLog.find({ orgId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        await attachUserToLogs(logs);

        const nextPage = skip + limit < totalLogs ? page + 1 : null;

        console.log({ page, limit, skip, totalLogs, nextPage, logs: logs.length });

        res.status(200).json({
            success: true,
            data: logs,
            nextPage,
        });
    } catch (error) {
        next(error);
    }
};

