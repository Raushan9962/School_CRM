const prisma = require('../config/prismaClient');

exports.createBook = async (req, res) => {
    try {
        const item = await prisma.book.create({ data: req.body });
        res.status(201).json({ message: 'Book created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating book' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const items = await prisma.book.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching books' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching book' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.book.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Book updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.book.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting book' });
    }
};
