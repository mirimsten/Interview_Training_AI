const express = require('express');
const router = express.Router();
const { getSkillNameById } = require('../controllers/skillController');

// קריאה ל-Skill Name לפי Skill ID
router.get('/:skillId', getSkillNameById);

module.exports = router;
