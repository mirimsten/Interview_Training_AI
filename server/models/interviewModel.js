const db = require('../DB');

async function createInterview(user_id, skill_id, interview_date, feedback ) {
    try {
        // הכנסת משתמש לטבלת users
        const sqlInterview = `INSERT INTO interviews (user_id, skill_id, interview_date, feedback ) VALUES (?, ?, ?, ?)`;
        const [resultInterview] = await db.query(sqlInterview, [user_id, skill_id, interview_date, feedback ]);

        if (!resultInterview.insertId) {
            console.error('Failed to insert interview into interviews table.');
            throw new Error('Failed to insert interview.');
        }
        return resultInterview.insertId;

    } catch (err) {
        console.error('Error in createInterview function:', err.message);
        throw err;
    }
}

async function getPreviousInterviews(id) {
    try {
        console.log("model interviews "+id);
        const sql = 'SELECT * FROM interviews WHERE user_id = ?';
        const [rows] = await db.query(sql, [id]);
        console.log(`interviews result: ${rows}`); // בדוק את התוצאה
        return rows; // תמיד תחזיר מערך
    } catch (err) {
        throw new Error("Error in getUserByEmail: " + err.message);
    }
}







module.exports = { createInterview ,getPreviousInterviews};