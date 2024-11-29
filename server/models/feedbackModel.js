// models/feedbackModel.js
const db = require('../DB');

// שמירת פידבק במסד הנתונים
const saveFeedback = async (interview_id, feedback_text, rating) => {
    const updateQuery = `
       UPDATE interviews
      SET feedback = ?
      WHERE interview_id = ?;
    `;
    const insertFeedbackQuery = `
      INSERT INTO general_feedback (interview_id, feedback_text, rating)
      VALUES (?, ?, ?);
    `;
    try {
        const [updateResult] = await db.execute(updateQuery, [feedback_text, interview_id]);
        const [insertResult] = await db.execute(insertFeedbackQuery, [interview_id, feedback_text, rating]);
        return { updateResult, insertResult };
    } catch (error) {
        throw error; // מעביר את השגיאה לטיפול בשכבת הבקר
    }
};

module.exports = { saveFeedback };
 