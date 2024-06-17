const mongoose = require('mongoose');

const InteractionSchema = mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
        },
        //add all the interactions for a customer service chat
        //add this to new model ->
        // problem_statement: {
        //     type: String,
        //     required: true,
        // },
        // problem_class: {
        //     type: String,
        //     required: true,
        // },

        //--
        //user's response and file urls
        //technical expert's response as array of strings and file urls as array of strings
    },
    {
        timestamps: true,
    }
);

const Interaction = mongoose.model("Interaction", InteractionSchema);

module.exports = Interaction;
