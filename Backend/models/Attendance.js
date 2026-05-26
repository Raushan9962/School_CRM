const BaseModel = require('./BaseModel');

class Attendance extends BaseModel {
    constructor() {
        super('attendance');
    }
}

module.exports = new Attendance();
