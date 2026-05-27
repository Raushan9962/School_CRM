const BaseModel = require('./BaseModel');

class Inventory extends BaseModel {
    constructor() {
        super('inventory');
    }
}

module.exports = new Inventory();
