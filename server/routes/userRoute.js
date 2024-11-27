const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");


//signUp

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {

        // קריאה לפונקציה ליצירת משתמש
        const id = await controller.createUser(username, email, password);

        if (!id) {
            console.error('Failed to retrieve user ID.');
            return res.status(500).json({ error: 'Failed to save user.' });
        }

        console.log("User created successfully with ID:", id);
        return res.status(201).json({ message: 'User registered successfully!' });

    } catch (err) {
        console.error('Error during user signup:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router; // ייצוא ה-Router
