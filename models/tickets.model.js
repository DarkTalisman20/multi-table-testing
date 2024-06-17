const mongoose = require('mongoose');
const Interaction = require('./interactions.model.js'); // Import Interaction model

const TicketSchema = mongoose.Schema(
    {
        problem_class: {
            type: String,
            required: true,
        },
        problem_statement: {
            type: String,
            required: true,
        },
        //user_id
        customer_email: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        organizationID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attachments: {
            type: String,
            required: false,
        },
        //add the attachments - user file urls, as well as technical expert's file url for the fix
        // add the conversations in the interactions model and add technical expert's id as a new field in the tickets.
        status: {
            type: String, //enum
            //reason of closing ticket
            required: true,
        },
        //to think about if user can close the ticket or not
        reason_of_closing ticket : {
            type: String,
            required : false,
        },
        // role: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User',
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

// Post-save hook to create Interaction
TicketSchema.post('save', async function(doc) {
    try {
        const interaction = await Interaction.create({
            ticketId: doc._id,
            problem_statement: doc.problem_statement,
            problem_class: doc.problem_class,
        });
        console.log('Interaction created:', interaction);
    } catch (error) {
        console.error('Error creating interaction:', error);
    }
});

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;
