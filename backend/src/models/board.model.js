import mongoose from "mongoose";
import List from "./list.model.js";


const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    imageThumbUrl: {
        type: String,
        required: true
    },
    imageFullUrl: {
        type: String,
        required: true
    },
    imageUserName: {
        type: String,
        required: true
    },
    imageLinkHTML: {
        type: String,
        required: true
    },
    checkpoints: [{
        checkpointId: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkpoint' },
        createdAt: { type: Date, required: true }
    }]
}, { timestamps: true });


// cascade delete lists when a board is deleted
boardSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await List.deleteMany({ board_id: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

const Board = mongoose.model("Board", boardSchema);

export default Board;