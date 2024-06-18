import express from 'express';
import mongoose from 'mongoose';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
import User from './models/user.model.js';
import Ticket from './models/tickets.model.js';
import TechExp from './models/techexp.model.js';
import Conversation from './models/conversations.model.js'; // Added import for Conversation model

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const projectId = 'climeup-bcq9';
const languageCode = 'en-US';
const sessionClient = new SessionsClient({
  keyFilename: 'D:/climeup-bcq9-6d91ae0d2d66.json'
});

mongoose.connect("mongodb+srv://epsilon:multitabletesting@cluster0.k6guqe3.mongodb.net/multitable?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected."))
  .catch(() => console.log("Connection failed"));

app.post('/createIssue', async (req, res) => {
  const { name, email, organizationID, roles, problemStatement } = req.body;

  try {
    // Check if User Exists
    let user = await User.findOne({ email: email });
    if (!user) {
      // Create User if Not Exists
      user = await User.create({ name, email, organizationID, roles });
    }

    // Fetch all Technical Experts
    const techExps = await TechExp.find({});
    if (techExps.length === 0) {
      return res.status(404).json({ message: 'No Technical Experts found.' });
    }

    // Select a Random Technical Expert
    const randomTechExp = techExps[Math.floor(Math.random() * techExps.length)];

    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: problemStatement,
          languageCode: languageCode,
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const classification = response.queryResult.intent.displayName;

    // Create Ticket with Randomly Selected Technical Expert's ID
    const newTicket = await Ticket.create({
      problem_class: classification,
      problem_statement: [problemStatement],
      customer_id: user._id,
      tech_exp_id: randomTechExp._id, // Use the randomly selected technical expert's ID
      status: 'open'
    });

    // Create a new conversation for the ticket
    const newConversation = new Conversation({
      ticket_id: newTicket._id,
      sessions: [] // Initialize with no sessions
    });
    await newConversation.save();

    res.json({ message: `Issue created with classification: ${classification}`, user: user, ticket: newTicket, conversation: newConversation });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

app.post('/addTechExp', async (req, res) => {
  const { name, email, EmployeeID, role } = req.body;

  try {
    // Check if TechExp already exists
    let techExp = await TechExp.findOne({ email: email });
    if (techExp) {
      return res.status(400).json({ message: 'Technical Expert already exists.' });
    }

    // Create new TechExp if not exists
    techExp = new TechExp({
      name,
      email,
      EmployeeID,
      role
    });

    await techExp.save();

    res.json({ message: 'New Technical Expert added successfully.', techExp: techExp });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'An error occurred while adding the Technical Expert.' });
  }
});

// Endpoint to create a new conversation when a ticket is created
// This endpoint is already integrated into '/createIssue'

// Endpoint to add a new session to a conversation
app.post('/conversations/:id/session', async (req, res) => {
  const { tech_exp_id, user_queries, response, reason_of_closing, urls, status } = req.body;
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          sessions: {
            tech_exp_id,
            user_queries,
            response,
            reason_of_closing,
            urls,
            status
          } 
        } 
      },
      { new: true }
    );
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error adding session', error: error.message });
  }
});

// Endpoint to add a user query to the latest session of a conversation
app.post('/conversations/:id/user_query', async (req, res) => {
  const { query } = req.body;
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    // Assuming we add the query to the last session
    const lastSessionIndex = conversation.sessions.length - 1;
    if (lastSessionIndex >= 0) {
      conversation.sessions[lastSessionIndex].user_queries.push(query);
      await conversation.save();
      res.json(conversation);
    } else {
      res.status(400).json({ message: 'No session available to add query' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding user query', error: error.message });
  }
});

// Endpoint to add an expert response to the latest session of a conversation
app.post('/conversations/:id/expert_response', async (req, res) => {
  const { response } = req.body;
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    // Assuming we add the response to the last session
    const lastSessionIndex = conversation.sessions.length - 1;
    if (lastSessionIndex >= 0) {
      conversation.sessions[lastSessionIndex].response.push(response);
      await conversation.save();
      res.json(conversation);
    } else {
      res.status(400).json({ message: 'No session available to add response' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding expert response', error: error.message });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));