const express = require('express');
const router = express.Router();
const controller = require("../controllers/userController");
const bcrypt = require('bcrypt');


// signUp
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

    } 
    catch (err) {
        console.error('Error during user signup:', err.message);
        
        // אם השגיאה היא על כך שהמשתמש כבר קיים
        if (err.message === "User already exists") {
            return res.status(400).json({ error: 'המשתמש כבר קיים' });  // הודעת שגיאה ברורה למייל קיים
        }
        
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Both email and password are required.' });
    }

    try {
        // בדיקה אם יש משתמש עם ה-email
        const user = await controller.logIn(email,password);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log("User logged in successfully:", user.id);
        return res.status(200).json({ message: 'Login successful!' });

    } catch (err) {
        console.error('Error during user login:', err.message);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router; // ייצוא ה-Router
