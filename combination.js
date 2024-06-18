import express from 'express';
import mongoose from 'mongoose';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
import User from './models/user.model.js';
import Ticket from './models/tickets.model.js';

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
  const sessionId = uuidv4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  try {
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

    const newUser = await User.create({ name, email, organizationID, roles });
    const newTicket = await Ticket.create({
      problem_class: classification,
      problem_statement: [problemStatement],
      customer_id: newUser._id,
      tech_exp_id: uuidv4(),
      status: 'open'
    });

    res.json({ message: `Issue created with classification: ${classification}`, user: newUser, ticket: newTicket });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'An error occurred.' });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));