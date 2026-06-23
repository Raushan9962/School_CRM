const BaseModel = require('./BaseModel');

class StaffAttendance extends BaseModel {
    constructor() {
        super('staff_attendance');
    }
}

module.exports = new StaffAttendance();
