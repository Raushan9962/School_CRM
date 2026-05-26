const Inventory = require('../models/Inventory');

exports.createInventory = async (req, res) => {
    try {
        const result = await Inventory.create(req.body);
        res.status(201).json({ message: 'Inventory created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating inventory' });
    }
};

exports.getAllInventorys = async (req, res) => {
    try {
        const results = await Inventory.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getInventoryById = async (req, res) => {
    try {
        const result = await Inventory.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const result = await Inventory.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json({ message: 'Inventory updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating inventory' });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const result = await Inventory.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json({ message: 'Inventory deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting inventory' });
    }
};
