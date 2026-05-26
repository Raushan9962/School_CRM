const BaseModel = require('./BaseModel');

class Bus extends BaseModel {
    constructor() {
        super('buses');
    }
}

module.exports = new Bus();
