const prisma = require('../config/prismaClient');

exports.createResult = async (req, res) => {
    try {
        const item = await prisma.result.create({ data: req.body });
        res.status(201).json({ message: 'Result created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating result' });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const items = await prisma.result.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching results' });
    }
};

exports.getResultById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.result.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching result' });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.result.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Result updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating result' });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.result.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting result' });
    }
};
