const mongoose = require('mongoose');

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
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = Ticket;

