const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    try {
        const result = await Book.create(req.body);
        res.status(201).json({ message: 'Book created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating book' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const results = await Book.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const result = await Book.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const result = await Book.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json({ message: 'Book updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const result = await Book.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting book' });
    }
};
