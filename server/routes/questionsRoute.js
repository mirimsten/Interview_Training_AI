const express = require('express');
const router = express.Router();
const controller = require("../controllers/questionsController");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();
const GEMINI_API_KEY = 'AIzaSyAvGug2EG0V4vqitmlTEtBmoiqNKyva0w0';

router.post('/getQuestions', async (req, res) => {
    const { jobTitle } = req.body;
    try {
        const questions = await generateInterviewQuestions(jobTitle);
        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

router.get('/getQuestions', async (req, res) => {
    try {
        const body=req.body;
       
        const newQuestion = await controller.createQuestion();
        if (newQuestion) {
            res.status(200).json(newQuestion);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add category' });
    }
});

async function generateInterviewQuestions(jobTitle) {
    console.log(process.env);
    console.log("API Key:", GEMINI_API_KEY);
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//   אתה מראיין מנוסה לתפקיד של ${jobTitle}.
//     ספק לי 5 שאלות ראיון בעברית מאתגרות ומלאות תובנות עבור מועמד המתמודד על תפקיד זה אל תוסיף שום מילים שאנן קשורות לתוכן השאלות  
//   עצב את התגובה שלך כרשימה ממוספרת
//   `;
  const prompt = `You are an experienced interviewer for the position of ${jobTitle}.
  Provide me with 5 challenging and insightful interview questions in English for a candidate applying for this position. Do not add any words that are unrelated to the content of the questions.
  Format your response as a numbered list.`;

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

router.post('/createQuestion', async (req, res) => {
    const { jobId,userId,interviewId,question } = req.body;
    try{
        console.log("route sent: "+ userId);
        const questionId = await controller.createQuestion(jobId, userId, interviewId, question);
        if (!questionId) {
            console.error('Failed to retrieve question ID.');
            return res.status(500).json({ error: 'Failed to save question.' });
        }

        console.log("Question created successfully with ID:", questionId);
        return res.status(201).json({ message: 'Question created successfully', questionId });

    }
    catch (error) {
        console.error('Error creating question:', error);
        return ['Error creating question'];  // במקרה של שגיאה
    }
})

module.exports = router;