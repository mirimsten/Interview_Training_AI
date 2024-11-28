const model = require('../models/interviewModel');

async function createInterview( user_id, skill_id, interview_date, feedback ) {

            try {
                console.log("controller iterview" + user_id);
                const newInterview = await model.createInterview(user_id, skill_id, interview_date, feedback );
                console.log("createInterviewController " + newInterview);
                return newInterview;
            }
            catch (err) {
                throw new Error("Error creating Interview: " + err.message);
            }
       
}

module.exports ={createInterview}