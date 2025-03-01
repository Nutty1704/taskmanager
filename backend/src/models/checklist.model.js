import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    items: [{
        text: {
            type: String,
            required: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    }]
}, { timestamps: true });


checklistSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    try {
        const checklistId = this._id;
        const cardId = this.cardId;

        if (!cardId) return next();

        const Card = mongoose.model("Card");
        await Card.updateOne(
            { _id: cardId },
            { $pull: { checklists: checklistId } }
        );

        next();
    } catch (error) {
        console.error(`Error removing checklist ${this._id} from card ${this.cardId}:`, error);
        next(error);
    }
});


checklistSchema.pre('remove', async function (next) {
    try {
        await this.model('Card').updateOne({ _id: this.cardId }, { $pull: { checklists: this._id } });
        next();
    } catch (error) {
        next(error);
    }
});

const Checklist = mongoose.model('Checklist', checklistSchema);

export default Checklist;