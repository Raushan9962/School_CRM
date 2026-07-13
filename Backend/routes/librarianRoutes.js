const express = require('express');
const router = express.Router();
const librarianController = require('../controllers/librarianController');
const { auth, restrictTo } = require('../middleware/auth');

// Protect all librarian routes
router.use(auth);
// Note: allowing School Admin as well so they can manage if needed.
router.use(restrictTo('Librarian', 'School Admin'));

// Dashboard Stats
router.get('/dashboard', librarianController.getDashboardStats);

// Books Management
router.get('/books', librarianController.getBooks);
router.post('/books', librarianController.addBook);
router.put('/books/:id', librarianController.updateBook);
router.delete('/books/:id', librarianController.deleteBook);

// Categories Management
router.get('/categories', librarianController.getCategories);
router.post('/categories', librarianController.addCategory);
router.put('/categories/:id', librarianController.updateCategory);
router.delete('/categories/:id', librarianController.deleteCategory);

// Settings
router.get('/settings', librarianController.getSettings);
router.put('/settings', librarianController.updateSettings);

// Issue & Return
router.post('/issue', librarianController.issueBook);
router.post('/return', librarianController.returnBook);

// Search member for scanning
router.get('/search-member', librarianController.searchMember);

module.exports = router;
