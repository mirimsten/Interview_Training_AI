const db = require('../DB');

async function getUserByEmail(email) {
    try {
        const sql = 'SELECT * FROM users WHERE users.email = ?';
        const [rows] = await db.query(sql, [email]);
        console.log(`getUserByEmail result: ${JSON.stringify(rows)}`); // בדוק את התוצאה
        return rows; // תמיד תחזיר מערך
    } catch (err) {
        throw new Error("Error in getUserByEmail: " + err.message);
    }
}
async function getPasswordByUserID(userID) {
    try {
        const sql = 'SELECT password FROM passwords WHERE userID = ?';
        const [rows] = await pool.query(sql, [userID]);
        return rows;
    } catch (err) {
        throw err;
    }
}
async function createUser(userName, email, cryptedPassword) {
    try {
        // הכנסת משתמש לטבלת users
        const sqlUser = `INSERT INTO users (username, email) VALUES (?, ?)`;
        const [resultUser] = await db.query(sqlUser, [userName, email]);

        if (!resultUser.insertId) {
            console.error('Failed to insert user into users table.');
            throw new Error('Failed to insert user.');
        }

        const userID = resultUser.insertId;
        console.log("Generated user ID:", userID);

        // הכנסת הסיסמה לטבלת passwords
        const sqlPassword = `INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)`;
        await db.query(sqlPassword, [userID, cryptedPassword]);
        console.log("Password inserted successfully for user ID:", userID);

        return userID;

    } catch (err) {
        console.error('Error in createUser function:', err.message);
        throw err;
    }
}
module.exports = { createUser, getUserByEmail, getPasswordByUserID };