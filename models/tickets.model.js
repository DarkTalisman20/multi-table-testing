import mongoose from 'mongoose';

const TicketSchema = mongoose.Schema(
    {
        problem_class: {
            type: String,
            required: true,
        },

        problem_statement:{
            type: [String],
            required: true,
        },
        
        customer_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        tech_exp_id:{
            type: String,
            required: true,
        },

        urls:{
            //multiple urls at multiple stages of guidance
            type: [String],
            required: false,
        },

        status: {
            type: String,
            required: true,
            enum: ['open', 'pending', 'resolved','closed'], 
        },
        //make it as an array of objects if needed, try adding status of convo in the convo model if not possible here
        conversation_id:{
            type: [String],
            ref: 'Conversation',
            required: false,
        }
        
    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;