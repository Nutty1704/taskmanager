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
});

listSchema.pre('deleteMany', async function (next) {
    try {
        const lists = await this.model.find(this.getQuery()); // Get all lists being deleted
        const listIds = lists.map(list => list._id);
        await Card.deleteMany({ listId: { $in: listIds } });
        next();
    } catch (error) {
        next(error);
    }
});


const List = mongoose.model("List", listSchema);

export default List;