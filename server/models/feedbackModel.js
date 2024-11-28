// models/feedbackModel.js
const db = require('../DB');

// שמירת פידבק במסד הנתונים
const saveFeedback = async (interviewId, feedback) => {
    const query = `
       UPDATE interviews
      SET feedback = ?
      WHERE interview_id = ?;
    `;
    try {
        const [result] = await db.execute(query, [feedback, interviewId]);
        return result;
    } catch (error) {
        throw error; // מעביר את השגיאה לטיפול בשכבת הבקר
    }
};

module.exports = { saveFeedback };
