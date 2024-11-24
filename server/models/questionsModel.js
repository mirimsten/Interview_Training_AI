const pool = require('../DB.js');


async function createQuestion() {
    try {
        const sql = `
       INSERT INTO Questions (skill_id, user_id, question_text)VALUES (1, 2, 'מהו ההבדל בין מתודולוגיות פיתוח Agile ו-Waterfall?');  `;
        await pool.query(sql);
    } catch (err) {
        return (err);
    }
}
module.exports ={createQuestion}