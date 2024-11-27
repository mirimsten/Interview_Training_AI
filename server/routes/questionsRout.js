const express = require('express');
const router = express.Router();
const controller = require("../controllers/questionsController");

router.post('/', async (req, res) => {
    try {
        const newQuestion = await controller.createQuestion();
        if (newQuestion) {
            res.status(200).json(newQuestion);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add category' });
    }
});