const model = require('../models/questionsModel');


async function createQuestion() {
    try {
        return await model.createQuestion()
    } catch (err) {
        throw err;
    }
}

module.exports ={createQuestion}
