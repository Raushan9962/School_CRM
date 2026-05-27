const BaseModel = require('./BaseModel');

class Fee extends BaseModel {
    constructor() {
        super('fees');
    }
}

module.exports = new Fee();
