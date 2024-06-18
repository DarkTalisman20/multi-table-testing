import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    tech_exp_id: {
        type: String,
        required: true,
    },
    user_queries: {
        type: [String],
        required: true,
    },
    response: {
        type: [String],
        required: true,
    },
    reason_of_closing: {
        type: String,
        required: false,
    },
    urls: {
        type: [String],
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'resolved'],
    },
}, { timestamps: true });

const conversationsSchema = mongoose.Schema({
    ticket_id: {
        type: String,
        required: true,
        ref: 'tickets'
    },
    sessions: [sessionSchema],
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationsSchema);

export default Conversation;