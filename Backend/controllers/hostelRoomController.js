const prisma = require('../config/prismaClient');

exports.createHostelRoom = async (req, res) => {
    try {
        const item = await prisma.hostelRoom.create({ data: req.body });
        res.status(201).json({ message: 'HostelRoom created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating hostelRoom' });
    }
};

exports.getAllHostelRooms = async (req, res) => {
    try {
        const items = await prisma.hostelRoom.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching hostelRooms' });
    }
};

exports.getHostelRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.hostelRoom.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'HostelRoom not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching hostelRoom' });
    }
};

exports.updateHostelRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.hostelRoom.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'HostelRoom updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating hostelRoom' });
    }
};

exports.deleteHostelRoom = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.hostelRoom.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'HostelRoom deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting hostelRoom' });
    }
};
