const BaseModel = require('./BaseModel');

class Certificate extends BaseModel {
    constructor() {
        super('certificates');
    }
}

module.exports = new Certificate();
