const express = require('express');
const router = express.Router();
const controller = require("../controllers/interviewController");

// create interview
router.post('/createInterview', async (req, res) => {
    const { userId, jobId, interview_date, feedback } = req.body;
    console.log(userId);

    // if (!user_id || !skill_id || !interview_date, !feedback) {
    //     return res.status(400).json({ error: 'All fields are required.' });
    // }

    try {
        // קריאה לפונקציה ליצירת משתמש
        const interviewId = await controller.createInterview(userId, jobId, interview_date, feedback);

        if (!interviewId) {
            console.error('Failed to retrieve Interview ID.');
            return res.status(500).json({ error: 'Failed to save user.' });
        }

        console.log("interview created successfully with ID:", interviewId);
        return res.status(201).json({ message: 'Interview created successfully', interviewId });

    } 
    catch (err) {
        console.error('Error during created an interview:', err.message);
       
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;