import mongoose from "mongoose";


const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }
}, { timestamps: true });


const Card = mongoose.model("Card", cardSchema);

export default Card;