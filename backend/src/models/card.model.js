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
        default: ''
    },
    list_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    }
}, { timestamps: true });


cardSchema.virtual('list',{
    ref: 'List',
    localField: 'list_id',
    foreignField: '_id',
    justOne: true
});

cardSchema.get('toObject', { virtuals: true });
cardSchema.get('toJSON', { virtuals: true });


const Card = mongoose.model("Card", cardSchema);

export default Card;