const BaseModel = require('./BaseModel');

class Timetable extends BaseModel {
    constructor() {
        super('timetables');
    }
}

module.exports = new Timetable();
