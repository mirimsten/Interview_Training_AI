const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
//const questionsController = require("./controllers/questionsController");
const { log } = require('console');
const db = require('./DB');
app.use(express.urlencoded({ extended: true }));
dotenv.config();
//console.log(process.env.DB_PASSWORD);

const port = 3001;

app.use(cors());
app.use(express.json());


const userRoute=require("./routes/userRoute")
const questionRoute=require("./routes/questionsRoute")
const interviewRoute = require("./routes/interviewRout")
const answerRoute=require("./routes/answerRoute")
const feedbackRoute=require("./routes/feedbackRoute")
const skillRoutes = require('./routes/skillRoute');
app.use('/skills', skillRoutes);
app.use('/users',userRoute);
app.use('/questions', questionRoute);
app.use('/interviews', interviewRoute);
app.use('/feedback', feedbackRoute);
app.use('/answers', answerRoute);




// app.post('/getFeedback', async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const response = await generateFeedback(prompt);
//         res.json({ feedback: response });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to get feedback' });
//     }
// });

app.get('/getJobTitles', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT skill_id, skill_name FROM skills');
        res.json({ jobTitles: rows });
    } catch (error) {
        console.error("Error fetching job titles:", error);
        res.status(500).json({ error: "Failed to fetch skill_name" });
    }
});



// async function generateFeedback(prompt) {
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     try {
//         const result = await model.generateContent(prompt);
//         return result.response.text();
//     } catch (error) {
//         console.error('Error generating feedback:', error);
//         return 'Error processing your response.';
//     }
// }

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});