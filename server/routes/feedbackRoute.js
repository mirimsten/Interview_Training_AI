const express = require('express');
const router = express.Router();
const controller = require("../controllers/feedbackController");

// מסלול לשמירת פידבק
router.post('/saveFeedback', controller.saveFeedback);

module.exports = router;
