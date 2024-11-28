const express = require('express');
const router = express.Router();
const controller = require("../controllers/answerController");

// create interview
router.post('/createanswer', async (req, res) => {
    const { userId, questionId, answerText } = req.body;


    try {
        // קריאה לפונקציה ליצירת משתמש
        const answerId = await controller.createAnswer(userId, questionId, answerText);

        if (!answerId) {
            console.error('Failed to retrieve answer ID.');
            return res.status(500).json({ error: 'Failed to save answer.' });
        }

        console.log("answer created successfully with ID:", answerId);
        return res.status(201).json({ message: 'Answer created successfully', answerId });

    } 
    catch (err) {
        console.error('Error during created an answer:', err.message);
       
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;