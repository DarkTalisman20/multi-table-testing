const mongoose = require('mongoose');

const InteractionSchema = mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        problem_statement: {
            type: String,
            required: true,
        },
        problem_class: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Interaction = mongoose.model("Interaction", InteractionSchema);

module.exports = Interaction;
