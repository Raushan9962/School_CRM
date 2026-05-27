const BaseModel = require('./BaseModel');

class Homework extends BaseModel {
    constructor() {
        super('homework');
    }
}

module.exports = new Homework();
