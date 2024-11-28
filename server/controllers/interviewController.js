const model = require('../models/interviewModel');

async function createInterview( user_id, skill_id, interview_date, feedback ) {

            try {
                const newInterview = await model.createInterview(user_id, skill_id, interview_date, feedback );
                
                return newInterview;
            }
            catch (err) {
                throw new Error("Error creating Interview: " + err.message);
            }
       
}

module.exports ={createInterview}