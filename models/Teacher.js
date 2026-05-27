const BaseModel = require('./BaseModel');

class Teacher extends BaseModel {
    constructor() {
        super('teachers');
    }
}

module.exports = new Teacher();
