const mongoose = require('mongoose');

const conversations = mongoose.Schema(
    {
        //Reference to ticket_id
        ticket_id: {
            type: String,
            required: true,
            ref: 'Ticket'
        },
        // the experts id which we need to add
        tech_exp_id:{
            type: String,
            required: true,
        },
        // response given by the expert
        response: {
            //multiple responses while guiding for a solution
            type: [String],
            required: true,
        },
        // the reason which is optional that is given by the expert while closing
        reason_of_closing: {
            type: String,
            required: false,
        },
        //optional
        urls:{
            //multiple urls at multiple stages of guidance
            type: [String],
            required: false
        },
        //add the user queries here
        //check for the queries and responses
    },
    {
        timestamps: false,
    }
);

const Conversation = mongoose.model("Conversation", conversations);

module.exports = Conversation;
