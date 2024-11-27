const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const questionsController = require("./server/controllers/questionsController");
const { log } = require('console');
const db = require('./server/DB');
const bcrypt = require('bcrypt');

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

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // קריאה לפונקציה ליצירת משתמש
        const id = await createUser(username, email, hashedPassword);
        
        if (!id) {
            console.error('Failed to retrieve user ID.');
            return res.status(500).json({ error: 'Failed to save user.' });
        }

        console.log("User created successfully with ID:", id);
        return res.status(201).json({ message: 'User registered successfully!' });

    } catch (err) {
        console.error('Error during user signup:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

async function createUser(userName, email, cryptedPassword) {
    try {
        // הכנסת משתמש לטבלת users
        const sqlUser = `INSERT INTO users (username, email) VALUES (?, ?)`;
        const [resultUser] = await db.query(sqlUser, [userName, email]);
        
        if (!resultUser.insertId) {
            console.error('Failed to insert user into users table.');
            throw new Error('Failed to insert user.');
        }
        
        const userID = resultUser.insertId;
        console.log("Generated user ID:", userID);

        // הכנסת הסיסמה לטבלת passwords
        const sqlPassword = `INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)`;
        await db.query(sqlPassword, [userID, cryptedPassword]);
        console.log("Password inserted successfully for user ID:", userID);

        return userID;

    } catch (err) {
        console.error('Error in createUser function:', err.message);
        throw err;
    }
}

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