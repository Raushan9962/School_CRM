const SubscriptionPlan = require('../models/SubscriptionPlan');

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.findAll();
        // Sort plans by max_students ascending, putting NULL (unlimited) at the end
        plans.sort((a, b) => {
            if (a.max_students === null) return 1;
            if (b.max_students === null) return -1;
            return a.max_students - b.max_students;
        });
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch subscription plans' });
    }
};
