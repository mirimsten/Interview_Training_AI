const db = require('../DB');

async function createAnswer(user_id, question_id, answer_text ) {
    try {
        // הכנסת משתמש לטבלת users
        const sqlAnswer = `INSERT INTO answers (user_id, question_id, answer_text) VALUES (?, ?, ?)`;
        const [resultAnswer] = await db.query(sqlAnswer, [user_id, question_id, answer_text]);

        if (!resultAnswer.insertId) {
            console.error('Failed to insert answer into answers table.');
            throw new Error('Failed to insert answer.');
        }
        return resultAnswer.insertId;

    } catch (err) {
        console.error('Error in create answer function:', err.message);
        throw err;
    }
}

module.exports = { createAnswer };