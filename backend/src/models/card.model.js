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
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        default: []
    }],
    startDate: {
        type: Date,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    assignedTo: [{
        type: String,
        ref: 'User',
        default: []
    }]
}, { timestamps: true });


cardSchema.virtual('list',{
    ref: 'List',
    localField: 'list_id',
    foreignField: '_id',
    justOne: true
});

cardSchema.get('toObject', { virtuals: true });
cardSchema.get('toJSON', { virtuals: true });


cardSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const cardId = this._id;

    try {
        const User = mongoose.model('User');
        await User.updateMany(
            { cards: cardId },
            { $pull: { cards: cardId } }
        );
        next();
    } catch (err) {
        console.error(`Error during cleanup for card ${cardId}:`, err);
        next(err);
    }
});

cardSchema.pre('deleteMany', async function (next) {
    try {
        const filter = this.getFilter();
        const cardsToDelete = await mongoose.model('Card').find(filter, '_id');
        const cardIds = cardsToDelete.map(card => card._id);

        if (cardIds.length > 0) {
            const User = mongoose.model('User');
            await User.updateMany(
                { cards: { $in: cardIds } },
                { $pull: { cards: { $in: cardIds } } }
            );
        }

        next();
    } catch (err) {
        console.error(`Error during cleanup for deleteMany operation:`, err);
        next(err);
    }
});


const Card = mongoose.model("Card", cardSchema);

export default Card;