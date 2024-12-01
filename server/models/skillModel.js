const db = require('../DB'); // חיבור למסד הנתונים

// פונקציה לשליפת שם מיומנות לפי ID
const findSkillById = async (skillId) => {
    const query = 'SELECT skill_name FROM Skills WHERE skill_id = ?';
    console.log("model"+skillId);
    const [rows] = await db.execute(query, [skillId]);
    console.log("model skill" + rows)
    console.log(rows[0].skill_name);
    // אם נמצאה שורה, מחזירים את שם המיומנות
    return rows.length > 0 ? rows[0].skill_name : null;
};

module.exports = { findSkillById };
