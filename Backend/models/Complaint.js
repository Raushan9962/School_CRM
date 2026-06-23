const BaseModel = require('./BaseModel');

class Complaint extends BaseModel {
    constructor() {
        super('complaints');
    }
}

module.exports = new Complaint();
