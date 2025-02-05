import mongoose from "mongoose";


const labelSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    color: {
        type: Number,
        required: true
    },
    boardId: {
        type: String,
        required: true
    }
});

labelSchema.index({ boardId: 1 });

labelSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return;
    await mongoose.model('Card').updateMany(
        { labels: doc._id }, 
        { $pull: { labels: doc._id } }
    );
});

const Label = mongoose.model('Label', labelSchema);

export default Label;