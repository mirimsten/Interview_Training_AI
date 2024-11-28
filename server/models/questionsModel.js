const db = require('../DB.js');


async function createQuestion(skill_id, user_id, interview_id, question_text) {
    try {
        const sqlQuestion = `INSERT INTO questions (skill_id, user_id, interview_id, question_text ) VALUES (?, ?, ?, ?)`;
        const [resultQuestion] = await db.query(sqlQuestion, [skill_id, user_id, interview_id, question_text]);

        if (!resultQuestion.insertId) {
            console.error('Failed to insert question into questions table.');
            throw new Error('Failed to insert question.');
        }
        return resultQuestion.insertId;

    } catch (err) {
        console.error('Error in create questions function:', err.message);
        throw err;
    }
}
module.exports ={createQuestion}