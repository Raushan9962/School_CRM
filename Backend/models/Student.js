const BaseModel = require('./BaseModel');

class Student extends BaseModel {
    constructor() {
        super('students');
    }
}

module.exports = new Student();
