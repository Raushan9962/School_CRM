const BaseModel = require('./BaseModel');

class Class extends BaseModel {
    constructor() {
        super('classes');
    }
}

module.exports = new Class();
