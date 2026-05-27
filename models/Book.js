const BaseModel = require('./BaseModel');

class Book extends BaseModel {
    constructor() {
        super('books');
    }
}

module.exports = new Book();
