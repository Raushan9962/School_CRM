const BaseModel = require('./BaseModel');

class HostelWarden extends BaseModel {
    constructor() {
        super('hostel_wardens');
    }
}

module.exports = new HostelWarden();
