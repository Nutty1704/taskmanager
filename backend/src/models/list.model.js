import mongoose from "mongoose";
import Card from "./card.model.js";


const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    board_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
    },
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        }
    ]
}, { timestamps: true });


// cascade delete cards when a list is deleted
listSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await Card.deleteMany({ list_id: this._id });
        next();
    } catch (error) {
        next(error);
    }
})


const List = mongoose.model("List", listSchema);

export default List;