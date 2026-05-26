const Bus = require('../models/Bus');

exports.createBus = async (req, res) => {
    try {
        const result = await Bus.create(req.body);
        res.status(201).json({ message: 'Bus created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating bus' });
    }
};

exports.getAllBuss = async (req, res) => {
    try {
        const results = await Bus.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getBusById = async (req, res) => {
    try {
        const result = await Bus.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateBus = async (req, res) => {
    try {
        const result = await Bus.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json({ message: 'Bus updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating bus' });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        const result = await Bus.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting bus' });
    }
};
