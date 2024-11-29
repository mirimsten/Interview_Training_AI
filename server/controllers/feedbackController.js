// controllers/feedbackController.js
const model = require('../models/feedbackModel');

// בקר לשמירת פידבק
async function saveFeedback(interview_id, feedback_text, rating){

    try {
        const result = await model.saveFeedback(interview_id, feedback_text, rating);
        return result;

    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ success: false, message: 'Error saving feedback' });
    }
};

module.exports = { saveFeedback };
