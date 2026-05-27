const BaseModel = require('./BaseModel');

class Event extends BaseModel {
    constructor() {
        super('events');
    }
}

module.exports = new Event();
