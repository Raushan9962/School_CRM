const BaseModel = require('./BaseModel');

class HRManager extends BaseModel {
    constructor() {
        super('hr_managers');
    }
}

module.exports = new HRManager();
