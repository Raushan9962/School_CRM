const prisma = require('../config/prismaClient');

exports.createBus = async (req, res) => {
    try {
        const item = await prisma.bus.create({ data: req.body });
        res.status(201).json({ message: 'Bus created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating bus' });
    }
};

exports.getAllBuss = async (req, res) => {
    try {
        const items = await prisma.bus.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching buss' });
    }
};

exports.getBusById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.bus.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching bus' });
    }
};

exports.updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.bus.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Bus updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating bus' });
    }
};

exports.deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.bus.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting bus' });
    }
};
