const mongoose = require('mongoose');

const InteractionSchema = mongoose.Schema(
    {
        problem_class: {
            type: String,
            required: true,
        },

        problem_statement:{
            type: String,
            required: true,
        },

    },
    {
        timestamps: false,
    }
);

const Interaction = mongoose.model("Interaction", InteractionSchema);

module.exports = Interaction;
