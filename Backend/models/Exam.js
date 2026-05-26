const BaseModel = require('./BaseModel');

class Exam extends BaseModel {
    constructor() {
        super('exams');
    }
}

module.exports = new Exam();
