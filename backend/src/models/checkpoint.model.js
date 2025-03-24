import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema({
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    snapshot: {
        type: Object,
        required: true
    }
});

const Checkpoint = mongoose.model('Checkpoint', checkpointSchema);

export default Checkpoint;