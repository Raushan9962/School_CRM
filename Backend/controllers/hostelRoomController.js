const HostelRoom = require('../models/HostelRoom');

exports.createHostelRoom = async (req, res) => {
    try {
        const result = await HostelRoom.create(req.body);
        res.status(201).json({ message: 'HostelRoom created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating hostelRoom' });
    }
};

exports.getAllHostelRooms = async (req, res) => {
    try {
        const results = await HostelRoom.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getHostelRoomById = async (req, res) => {
    try {
        const result = await HostelRoom.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'HostelRoom not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateHostelRoom = async (req, res) => {
    try {
        const result = await HostelRoom.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'HostelRoom not found' });
        res.status(200).json({ message: 'HostelRoom updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating hostelRoom' });
    }
};

exports.deleteHostelRoom = async (req, res) => {
    try {
        const result = await HostelRoom.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'HostelRoom not found' });
        res.status(200).json({ message: 'HostelRoom deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting hostelRoom' });
    }
};
