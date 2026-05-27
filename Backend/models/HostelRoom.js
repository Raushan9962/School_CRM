const BaseModel = require('./BaseModel');

class HostelRoom extends BaseModel {
    constructor() {
        super('hostel_rooms');
    }
}

module.exports = new HostelRoom();
