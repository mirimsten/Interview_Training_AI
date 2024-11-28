// controllers/feedbackController.js
const model = require('../models/feedbackModel');

// בקר לשמירת פידבק
const saveFeedback = async (req, res) => {
    const { interviewId, feedback } = req.body;
console.log("feedback controller "+interviewId +" "+feedback)
    // בדיקה האם כל הנתונים קיימים
    if (!interviewId || !feedback) {
        return res.status(400).json({ success: false, message: 'Missing interviewId or feedback' });
    }

    try {
        const result = await model.saveFeedback(interviewId, feedback);

        // בדיקה אם העדכון הצליח
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Interview not found' });
        }

        res.status(200).json({ success: true, message: 'Feedback saved successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ success: false, message: 'Error saving feedback' });
    }
};

module.exports = { saveFeedback };
