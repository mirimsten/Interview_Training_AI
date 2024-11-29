const model = require('../models/skillModel');

// פונקציה לשליפת שם מיומנות לפי ID
const getSkillNameById = async (req, res) => {
    const { skillId } = req.params;
    console.log("controller skill" + skillId)

    try {
        const skillName = await model.findSkillById(skillId);
        console.log("controller skill" + skillName)

        if (skillName) {
            res.status(200).json({ skillName });
        } else {
            res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        console.error('Error fetching skill name:', error);
        res.status(500).json({ error: 'Failed to fetch skill name' });
    }
};

module.exports = { getSkillNameById };
