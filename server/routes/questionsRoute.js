const express = require('express');
const router = express.Router();
const controller = require("../controllers/questionsController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

router.get('/getQuestions', async (req, res) => {
    try {
        const newQuestion = await controller.createQuestion();
        if (newQuestion) {
            res.status(200).json(newQuestion);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add category' });
    }
});

router.post('/getQuestions', async (req, res) => {
    const { username, jobTitle } = req.body;
    try {
        const questions = await generateInterviewQuestions(jobTitle);
        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

async function generateInterviewQuestions(jobTitle) {
    console.log(process.env);
    console.log("API Key:", process.env.GEMINI_API_KEY);
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

module.exports = router;