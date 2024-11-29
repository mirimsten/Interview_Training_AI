const db = require('../DB'); // חיבור למסד הנתונים

// פונקציה לשליפת שם מיומנות לפי ID
const findSkillById = async (skillId) => {
    const query = 'SELECT skill_name FROM Skills WHERE skill_id = ?';
    const [rows] = await db.execute(query, [skillId]);
    console.log("model skill" + rows)
    // אם נמצאה שורה, מחזירים את שם המיומנות
    return rows.length > 0 ? rows[0].skill_name : null;
};

module.exports = { findSkillById };
