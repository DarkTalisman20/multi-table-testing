const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user.model.js');
const Ticket = require('./models/tickets.model.js');
const Interaction = require('./models/interactions.model.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("Testing Node API server");
});

// Add User Route
app.post('/adduser', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Ticket Route
app.post('/addticket', async (req, res) => {
    try {
        const { customer_email, organizationID, role, ...ticketData } = req.body;

        // Find the user by email to get their ObjectId
        const user = await User.findOne({ email: customer_email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the ticket with references to the user's ObjectId
        const ticket = await Ticket.create({
            ...ticketData,
            customer_email: user._id,
            organizationID: user.organizationID,
            role: user._id,
        });

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Tickets Route
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate({
                path: 'customer_email',
                select: 'email', // Select only the email field from the User model
            })
            .populate({
                path: 'organizationID',
                select: 'organizationID', // Select only the organizationID field from the User model
            })
            .populate({
                path: 'role',
                select: 'roles', // Select only the roles field from the User model
            });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Interactions Route
app.get('/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.find();
        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Connect to MongoDB and Start Server
mongoose.connect("mongodb+srv://epsilon:multitabletesting@cluster0.k6guqe3.mongodb.net/multitable?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });
