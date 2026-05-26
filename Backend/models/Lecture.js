const BaseModel = require('./BaseModel');

class Lecture extends BaseModel {
    constructor() {
        super('lectures');
    }
}

module.exports = new Lecture();
