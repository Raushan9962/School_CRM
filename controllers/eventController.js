const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        const result = await Event.create(req.body);
        res.status(201).json({ message: 'Event created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating event' });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const results = await Event.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const result = await Event.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const result = await Event.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const result = await Event.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting event' });
    }
};
