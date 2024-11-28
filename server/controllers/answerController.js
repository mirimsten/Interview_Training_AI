const model = require('../models/answerModel');

async function createAnswer( user_id, question_id, answer_text ) {

            try {
                const newAnswer = await model.createAnswer(user_id, question_id, answer_text );
                
                return newAnswer;
            }
            catch (err) {
                throw new Error("Error creating Answer: " + err.message);
            }
       
}

module.exports ={createAnswer}