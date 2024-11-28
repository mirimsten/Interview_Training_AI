const model = require('../models/questionsModel');


async function createQuestion(skill_id, user_id, interview_id, question_text) {
    try {
        const newQuestion = await model.createQuestion(skill_id, user_id, interview_id, question_text );
        
        return newQuestion;
    }
    catch (err) {
        throw new Error("Error creating Question: " + err.message);
    }
}

module.exports ={createQuestion}
