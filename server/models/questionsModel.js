const pool = require('../DB.js');


async function createQuestion() {
    try {
        const sql = `INSERT INTO Questions (skill_id, user_id, question_text, interview_id) 
        VALUES (1, 1, 'מהו ההבדל בין מתודולוגיות פיתוח Agile ו-Waterfall?', 1);`;
        await pool.query(sql);
    } catch (err) {
        return (err);
    }
}
module.exports ={createQuestion}