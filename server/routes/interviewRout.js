const express = require('express');
const router = express.Router();
const controller = require("../controllers/interviewController");

// create interview
router.post('/createInterview', async (req, res) => {
    const { user_id, skill_id, interview_date, feedback } = req.body;
    console.log(user_id);

    // if (!user_id || !skill_id || !interview_date, !feedback) {
    //     return res.status(400).json({ error: 'All fields are required.' });
    // }

    try {
        // קריאה לפונקציה ליצירת משתמש
        const id = await controller.createInterview(user_id, skill_id, interview_date, feedback);

        if (!id) {
            console.error('Failed to retrieve user ID.');
            return res.status(500).json({ error: 'Failed to save user.' });
        }

        console.log("interview created successfully with ID:", id);
        return res.status(201).json({ message: 'interview created successfully!' });

    } 
    catch (err) {
        console.error('Error during created an interview:', err.message);
       
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;