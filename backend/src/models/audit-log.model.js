import mongoose from "mongoose";


export const auditLogEntityTypes = ["board", "list", "card"];

export const auditLogActions = ["create", "update", "delete"];

const auditLogSchema = new mongoose.Schema({
    entityType: {
        type: String,
        required: true,
        enum: auditLogEntityTypes
    },
    action: {
        type: String,
        required: true,
        enum: auditLogActions
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    entityTitle: {
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;