const BaseModel = require('./BaseModel');

class Course extends BaseModel {
    constructor() {
        super('courses');
    }
}

module.exports = new Course();
