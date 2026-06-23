const Book = require('../models/Book');
const pool = require('../config/db');

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

exports.getTransactionsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query(`
            SELECT t.*, b.title, b.author, b.isbn 
            FROM library_transactions t
            JOIN books b ON t.book_id = b.id
            WHERE t.user_id = $1
            ORDER BY t.issued_on DESC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user library transactions' });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { book_id, user_id, issued_on, due_on } = req.body;
        
        // Check availability
        const book = await Book.findById(book_id);
        if (!book || book.available <= 0) {
            return res.status(400).json({ error: 'Book is not available' });
        }

        const result = await pool.query(`
            INSERT INTO library_transactions (book_id, user_id, issued_on, due_on, status)
            VALUES ($1, $2, $3, $4, 'Issued') RETURNING *
        `, [book_id, user_id, issued_on, due_on]);

        // Reduce availability
        await pool.query('UPDATE books SET available = available - 1 WHERE id = $1', [book_id]);

        res.status(201).json({ message: 'Book issued successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error issuing book' });
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
