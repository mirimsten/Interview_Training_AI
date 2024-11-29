const model = require('../models/interviewModel');

async function createInterview(user_id, skill_id, interview_date, feedback) {

    try {
        const newInterview = await model.createInterview(user_id, skill_id, interview_date, feedback);

        return newInterview;
    }
    catch (err) {
        throw new Error("Error creating Interview: " + err.message);
    }
}
const getPreviousInterviews = async (req, res) => {
    try {
        const { userId } = req.params; // שליפת ה-userId מהפרמטרים של ה-URL
        console.log("controller interviews"+ userId)
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // חיפוש ראיונות לפי userId
        const interviews = await model.getPreviousInterviews(userId);

        // if (interviews.length === 0) {
        //     return res.status(404).json({ message: 'No previous interviews found' });
        // }

        res.status(200).json(interviews);
    } catch (error) {
        console.error('Error fetching interviews:', error);
        res.status(500).json({ error: 'Failed to fetch interviews' });
    }
};







module.exports = { createInterview, getPreviousInterviews }