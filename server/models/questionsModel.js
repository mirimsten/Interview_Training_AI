const db = require('../DB.js');


async function createQuestion(skill_id, user_id, interview_id, question_text) {
    try {
        console.log("model sent: "+user_id);
        const sqlQuestion = `INSERT INTO questions (skill_id, user_id, interview_id, question_text ) VALUES (?, ?, ?, ?)`;
        const [resultQuestion] = await db.query(sqlQuestion, [skill_id, user_id, interview_id, question_text]);

        if (!resultQuestion.insertId) {
            console.error('Failed to insert question into questions table.');
            throw new Error('Failed to insert question.');
        }
        //return resultQuestion.insertId;
        return {
            questionId: resultQuestion.insertId,
            questionText: question_text
        };

    } catch (err) {
        console.error('Error in create questions function:', err.message);
        throw err;
    }
}
module.exports ={createQuestion}