const BaseModel = require('./BaseModel');

class Result extends BaseModel {
    constructor() {
        super('results');
    }
}

module.exports = new Result();
