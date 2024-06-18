import express from 'express';
import { SessionsClient } from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const projectId = 'climeup-bcq9';
const languageCode = 'en-US';

const sessionClient = new SessionsClient({
  keyFilename: 'D:/mongo/climeup-bcq9-6d91ae0d2d66.json'
});

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.message;
  const sessionId = uuidv4(); 

  try {
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: userMessage,
          languageCode: languageCode,
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    const classification = result.intent.displayName;
    let ticketSubject;

    if (classification === "Technical Issue") {
      ticketSubject = "Technical Issue";
    } else if (classification === "Billing Issue") {
      ticketSubject = "Billing Issue";
    } else {
      return res.json({ message: "Sorry, I couldn't classify your issue. Please try again." });
    }

    console.log(classification)
    res.json({ message: `Your issue has been classified as a ${ticketSubject.toLowerCase()}.` });

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'An error occurred while processing your request. Please try again later.' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 3000');
});