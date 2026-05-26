const BaseModel = require('./BaseModel');

class Subject extends BaseModel {
    constructor() {
        super('subjects');
    }
}

module.exports = new Subject();
