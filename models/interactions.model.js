const mongoose = require('mongoose');

const InteractionSchema = mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        //add all the interactions for a customer service chat
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
