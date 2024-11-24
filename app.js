const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const questionsController = require("./server/controllers/questionsController")
//const { GoogleAIFileManager } = require("@google/generative-ai/server");

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

async function generateInterviewQuestions(jobTitle) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an experienced interviewer for the position of ${jobTitle}.
  Please provide me with 5 challenging and insightful interview questions for a candidate applying for this role. 
  Format your response as a numbered list
  `;

  try {
      const result = await model.generateContent(prompt);
      return result.response.text().split('\n'); // מחזיר רשימה של שאלות
  } catch (error) {
      console.error('Error generating questions:', error);
      return ['Error generating questions'];
  }
}

app.post('/getQuestions', async (req, res) => {
    const { jobTitle } = req.body;
    try {
        const questions = await generateInterviewQuestions(jobTitle);
        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

app.post('/getFeedback', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await generateFeedback(prompt);
        res.json({ feedback: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get feedback' });
    }
});

//app.use("/questions", questionsRout)
app.post('/questions', async (req, res) => {
    try {
        const newQuestion = await questionsController.createQuestion();
        if (newQuestion) {
            res.status(200).json(newQuestion);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add category' });
    }
});

async function generateFeedback(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating feedback:', error);
        return 'Error processing your response.';
    }
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});