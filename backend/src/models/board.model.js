import mongoose from "mongoose";


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
    }
}, { timestamps: true });


const Board = mongoose.model("Board", boardSchema);

export default Board;