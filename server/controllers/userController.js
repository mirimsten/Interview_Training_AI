const model = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10; // קביעת מספר סיבובי ההצפנה


async function CheckIfExist(email) {
    try {
        const user = await model.getUserByEmail(email);
        console.log("controller user:", user); // בדוק את המידע שמוחזר
        return user.length > 0 ? user[0] : null; // החזר null אם המשתמש לא נמצא
    } catch (err) {
        throw new Error("Error in CheckIfExist: " + err.message);
    }
}


async function createUser( username, email, password ) {
    try {

       const user = await CheckIfExist(email);
       console.log("User existence check result:", user);
       if (!user) {
            try {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const newUser = await model.createUser(username, email, hashedPassword);
                console.log("createUserController " + newUser);
                return newUser;
            }
            catch (err) {
                throw new Error("Error creating user: " + err.message);
            }
       } else {
           throw new Error("User already exists");
       }

    }
    catch (err) {
        throw new Error("Error in createUser: " + err.message);
    }
}
module.exports={createUser,CheckIfExist};