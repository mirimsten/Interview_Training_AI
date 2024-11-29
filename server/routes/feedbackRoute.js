const express = require('express');
const router = express.Router();
const controller = require("../controllers/feedbackController");
const { GoogleGenerativeAI } = require("@google/generative-ai");


router.post('/getFeedback', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await generateFeedback(prompt);
        res.json({ feedback: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get feedback' });
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

router.post('/saveFeedback', async (req, res) => {
    const { interviewId, feedback1, rating } = req.body;

    try {
        // קריאה לפונקציה ליצירת משתמש
        const id = await controller.saveFeedback(interviewId, feedback1, rating);

        if (!id) {
            console.error('Failed to retrieve feedback ID.');
            return res.status(500).json({ error: 'Failed to save user.' });
        }

        console.log("feedback created successfully with ID:", id);
        return res.status(201).json({ message: 'feedback created successfully!' });

    } 
    catch (err) {
        console.error('Error during feedback:', err.message);
  
        return res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;
