import mongoose from "mongoose";

export const BOARD_HISTORY_SIZE = 7;

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        default: [],
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
            message: 'Invalid card ID'
        }
    }],
    starredBoards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        default: []
    }],
    recentBoards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        default: []
    }]
}, { timestamps: true });

userSchema.index({ userId: 1, orgId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;