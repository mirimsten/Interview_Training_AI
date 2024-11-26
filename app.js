const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const questionsController = require("./server/controllers/questionsController");
const { log } = require('console');
const db = require('./server/DB');

//const { GoogleAIFileManager } = require("@google/generative-ai/server");

dotenv.config();
//console.log(process.env.DB_PASSWORD);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

async function generateInterviewQuestions(jobTitle) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
  אתה מראיין מנוסה לתפקיד של ${jobTitle}.
    ספק לי 5 שאלות ראיון בעברית מאתגרות ומלאות תובנות עבור מועמד המתמודד על תפקיד זה אל תוסיף שום מילים שאנן קשורות לתוכן השאלות  
  עצב את התגובה שלך כרשימה ממוספרת
  `;

    try {
        const result = await model.generateContent(prompt);
        let questionsList = result.response.text().split('\n');  // חיתוך התשובה לשורות

        // סינון תאים ריקים ומחיקת רווחים מיותרים
        questionsList = questionsList
            .map(question => question.trim())  // מסיר רווחים מיותרים בתחילת ובסוף כל שאלה
            .filter(question => question !== '');  // מסנן שאלות ריקות

        console.log(`questionsList: ${questionsList}`);
        return questionsList;  // מחזיר רשימה של שאלות מסודרות

    } catch (error) {
        console.error('Error generating questions:', error);
        return ['Error generating questions'];  // במקרה של שגיאה
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

app.get('/getJobTitles', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT skill_name FROM skills');
      res.json({ jobTitles: rows.map(row => row.skill_name) });
    } catch (error) {
      console.error("Error fetching job titles:", error);
      res.status(500).json({ error: "Failed to fetch skill_name" });
    }
  });

//app.use("/questions", questionsRout)
// app.post('/questions', async (req, res) => {
//     try {
//         const newQuestion = await questionsController.createQuestion();
//         if (newQuestion) {
//             res.status(200).json(newQuestion);
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to add category' });
//     }
// });

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