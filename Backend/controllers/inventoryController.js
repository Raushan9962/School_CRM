const prisma = require('../config/prismaClient');

exports.createInventory = async (req, res) => {
    try {
        const item = await prisma.inventory.create({ data: req.body });
        res.status(201).json({ message: 'Inventory created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating inventory' });
    }
};

exports.getAllInventorys = async (req, res) => {
    try {
        const items = await prisma.inventory.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching inventorys' });
    }
};

exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.inventory.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Inventory not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching inventory' });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.inventory.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Inventory updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating inventory' });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inventory.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Inventory deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting inventory' });
    }
};
