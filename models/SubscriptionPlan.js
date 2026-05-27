const BaseModel = require('./BaseModel');

class SubscriptionPlan extends BaseModel {
    constructor() {
        super('subscription_plans');
    }
}

module.exports = new SubscriptionPlan();
