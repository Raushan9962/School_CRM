const BaseModel = require('./BaseModel');

class Leave extends BaseModel {
    constructor() {
        super('leaves');
    }
}

module.exports = new Leave();
