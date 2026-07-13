const pool = require('../config/db');

// --- Dashboard Stats ---
exports.getDashboardStats = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        // Total Books
        const totalBooksRes = await pool.query('SELECT COUNT(*) FROM books WHERE school_id = $1', [schoolId]);
        const totalBooks = parseInt(totalBooksRes.rows[0].count);

        // Issued Books
        const issuedBooksRes = await pool.query("SELECT COUNT(*) FROM library_transactions t JOIN books b ON t.book_id = b.id WHERE b.school_id = $1 AND t.status = 'Issued'", [schoolId]);
        const issuedBooks = parseInt(issuedBooksRes.rows[0].count);

        // Overdue Books
        const overdueBooksRes = await pool.query("SELECT COUNT(*) FROM library_transactions t JOIN books b ON t.book_id = b.id WHERE b.school_id = $1 AND t.status = 'Issued' AND t.due_on < CURRENT_DATE", [schoolId]);
        const overdueBooks = parseInt(overdueBooksRes.rows[0].count);

        // Books Due Today
        const dueTodayRes = await pool.query("SELECT COUNT(*) FROM library_transactions t JOIN books b ON t.book_id = b.id WHERE b.school_id = $1 AND t.status = 'Issued' AND t.due_on = CURRENT_DATE", [schoolId]);
        const dueToday = parseInt(dueTodayRes.rows[0].count);

        // Available Books (Total - Issued)
        const availableBooks = totalBooks - issuedBooks;

        // Fines Collected
        const finesRes = await pool.query("SELECT COALESCE(SUM(fine), 0) as total_fines FROM library_transactions t JOIN books b ON t.book_id = b.id WHERE b.school_id = $1 AND t.status = 'Returned'", [schoolId]);
        const finesCollected = parseFloat(finesRes.rows[0].total_fines);

        res.status(200).json({
            success: true,
            stats: {
                totalBooks,
                availableBooks,
                issuedBooks,
                overdueBooks,
                dueToday,
                finesCollected,
                newBooksAdded: 0, // Placeholder
                activeMembers: 0 // Placeholder
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

// --- Books Management ---
exports.getBooks = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT b.*, c.name as category_name 
            FROM books b 
            LEFT JOIN book_categories c ON b.category_id = c.id 
            WHERE b.school_id = $1
            ORDER BY b.created_at DESC
        `, [schoolId]);
        res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch books' });
    }
};

exports.addBook = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { title, author, isbn, barcode, rack_location, publisher, language, edition, price, purchase_date, vendor_details, cover_image, category_id, quantity } = req.body;

        const result = await pool.query(`
            INSERT INTO books (
                school_id, title, author, isbn, barcode, rack_location, publisher, language, edition, price, purchase_date, vendor_details, cover_image, category_id, quantity, available, status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15, 'Available'
            ) RETURNING *
        `, [schoolId, title, author, isbn, barcode, rack_location, publisher, language, edition, price || 0, purchase_date || null, vendor_details, cover_image, category_id || null, quantity || 1]);

        res.status(201).json({ success: true, message: 'Book added successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'A book with this Barcode or ISBN already exists.' });
        }
        res.status(500).json({ success: false, message: 'Failed to add book' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;
        const { title, author, isbn, barcode, rack_location, publisher, language, edition, price, purchase_date, vendor_details, cover_image, category_id, quantity, status } = req.body;

        const result = await pool.query(`
            UPDATE books SET 
                title = $1, author = $2, isbn = $3, barcode = $4, rack_location = $5, publisher = $6, 
                language = $7, edition = $8, price = $9, purchase_date = $10, vendor_details = $11, 
                cover_image = $12, category_id = $13, quantity = $14, status = $15
            WHERE id = $16 AND school_id = $17 RETURNING *
        `, [title, author, isbn, barcode, rack_location, publisher, language, edition, price || 0, purchase_date || null, vendor_details, cover_image, category_id || null, quantity || 1, status || 'Available', id, schoolId]);

        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Book not found' });

        res.status(200).json({ success: true, message: 'Book updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update book' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;

        const result = await pool.query('DELETE FROM books WHERE id = $1 AND school_id = $2 RETURNING id', [id, schoolId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Book not found' });

        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete book. It may be linked to transactions.' });
    }
};

// --- Categories Management ---
exports.getCategories = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query('SELECT * FROM book_categories WHERE school_id = $1 ORDER BY name ASC', [schoolId]);
        res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { name, description } = req.body;
        
        if(!name) return res.status(400).json({success: false, message: 'Name is required'});

        const result = await pool.query('INSERT INTO book_categories (school_id, name, description) VALUES ($1, $2, $3) RETURNING *', [schoolId, name, description]);
        res.status(201).json({ success: true, message: 'Category added successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add category' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;
        const { name, description } = req.body;

        const result = await pool.query('UPDATE book_categories SET name = $1, description = $2 WHERE id = $3 AND school_id = $4 RETURNING *', [name, description, id, schoolId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });

        res.status(200).json({ success: true, message: 'Category updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update category' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;

        const result = await pool.query('DELETE FROM book_categories WHERE id = $1 AND school_id = $2 RETURNING id', [id, schoolId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
};

// --- Settings ---
exports.getSettings = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query('SELECT * FROM library_settings WHERE school_id = $1', [schoolId]);
        
        if (result.rows.length === 0) {
            // Auto create default
            const defRes = await pool.query('INSERT INTO library_settings (school_id) VALUES ($1) RETURNING *', [schoolId]);
            return res.status(200).json({ success: true, data: defRes.rows[0] });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { max_books_student, max_books_teacher, issue_duration_student, issue_duration_teacher, fine_per_day } = req.body;

        const result = await pool.query(`
            INSERT INTO library_settings (school_id, max_books_student, max_books_teacher, issue_duration_student, issue_duration_teacher, fine_per_day)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (school_id) DO UPDATE SET 
                max_books_student = EXCLUDED.max_books_student,
                max_books_teacher = EXCLUDED.max_books_teacher,
                issue_duration_student = EXCLUDED.issue_duration_student,
                issue_duration_teacher = EXCLUDED.issue_duration_teacher,
                fine_per_day = EXCLUDED.fine_per_day,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `, [schoolId, max_books_student, max_books_teacher, issue_duration_student, issue_duration_teacher, fine_per_day]);

        res.status(200).json({ success: true, message: 'Settings updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
};

// --- Search Member ---
exports.searchMember = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { query } = req.query; // can be admission_no, employee_id, username
        
        if (!query) return res.status(400).json({ success: false, message: 'Query parameter is required' });

        // Search Students
        const studentRes = await pool.query(`
            SELECT u.id as user_id, u.name, u.email, u.phone, u.role_name as role, u.image,
                   s.admission_no, s.roll_number, c.name as class_name, c.section,
                   s.father_name, s.mother_name
            FROM users u
            JOIN students s ON u.id = s.user_id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE u.school_id = $1 AND (s.admission_no ILIKE $2 OR u.username ILIKE $2 OR u.email ILIKE $2)
            LIMIT 1
        `, [schoolId, `%${query}%`]);

        let member = studentRes.rows[0];

        // Search Staff if not student
        if (!member) {
            const teacherRes = await pool.query(`
                SELECT u.id as user_id, u.name, u.email, u.phone, u.role_name as role, u.image,
                       t.employee_id, t.department
                FROM users u
                JOIN teachers t ON u.id = t.user_id
                WHERE u.school_id = $1 AND (t.employee_id ILIKE $2 OR u.email ILIKE $2)
                LIMIT 1
            `, [schoolId, `%${query}%`]);
            member = teacherRes.rows[0];
        }

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        // Get their active issues
        const issuesRes = await pool.query(`
            SELECT t.*, b.title, b.barcode
            FROM library_transactions t
            JOIN books b ON t.book_id = b.id
            WHERE t.user_id = $1 AND t.status = 'Issued'
        `, [member.user_id]);

        member.activeIssues = issuesRes.rows;

        // Calculate pending fine dynamically based on overdue issues
        // Simplified calculation for display: actual fine should be fetched from settings
        const settingsRes = await pool.query('SELECT fine_per_day FROM library_settings WHERE school_id = $1', [schoolId]);
        const finePerDay = settingsRes.rows[0]?.fine_per_day || 5;
        
        let pendingFine = 0;
        issuesRes.rows.forEach(issue => {
            const due = new Date(issue.due_on);
            const today = new Date();
            if (today > due) {
                const diffTime = Math.abs(today - due);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                pendingFine += (diffDays * finePerDay);
            }
        });
        member.pendingFine = pendingFine;

        res.status(200).json({ success: true, data: member });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to search member' });
    }
};

// --- Issue Book ---
exports.issueBook = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { user_id, barcode } = req.body;

        if (!user_id || !barcode) {
            return res.status(400).json({ success: false, message: 'User ID and Book Barcode are required' });
        }

        // Find Book
        const bookRes = await pool.query('SELECT * FROM books WHERE barcode = $1 AND school_id = $2', [barcode, schoolId]);
        if (bookRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Book not found' });
        const book = bookRes.rows[0];

        if (book.available <= 0 || book.status !== 'Available') {
            return res.status(400).json({ success: false, message: 'Book is currently not available for issue' });
        }

        // Check Settings & Roles
        const userRes = await pool.query('SELECT role_name FROM users WHERE id = $1', [user_id]);
        if(userRes.rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        const userRole = userRes.rows[0].role_name;

        const settingsRes = await pool.query('SELECT * FROM library_settings WHERE school_id = $1', [schoolId]);
        const settings = settingsRes.rows[0] || { issue_duration_student: 7, issue_duration_teacher: 30, max_books_student: 2, max_books_teacher: 5 };
        
        const isStudent = userRole.toLowerCase() === 'student';
        const maxBooks = isStudent ? settings.max_books_student : settings.max_books_teacher;
        const issueDays = isStudent ? settings.issue_duration_student : settings.issue_duration_teacher;

        // Check active issues count
        const activeIssuesRes = await pool.query("SELECT COUNT(*) FROM library_transactions WHERE user_id = $1 AND status = 'Issued'", [user_id]);
        if (parseInt(activeIssuesRes.rows[0].count) >= maxBooks) {
            return res.status(400).json({ success: false, message: `User has reached maximum limit of ${maxBooks} issued books` });
        }

        // Calculate due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + issueDays);

        await pool.query('BEGIN');

        // Insert Transaction
        const transRes = await pool.query(`
            INSERT INTO library_transactions (book_id, user_id, issued_on, due_on, status)
            VALUES ($1, $2, CURRENT_DATE, $3, 'Issued') RETURNING *
        `, [book.id, user_id, dueDate]);

        // Update book stock
        await pool.query("UPDATE books SET available = available - 1, status = CASE WHEN available - 1 = 0 THEN 'Issued' ELSE status END WHERE id = $1", [book.id]);

        await pool.query('COMMIT');
        
        // Return successfully with due date formatted
        res.status(200).json({ 
            success: true, 
            message: 'Book issued successfully', 
            data: transRes.rows[0],
            dueDate: dueDate.toISOString().split('T')[0]
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to issue book' });
    }
};

// --- Return Book ---
exports.returnBook = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { transaction_id, remarks, condition } = req.body;

        if (!transaction_id) {
            return res.status(400).json({ success: false, message: 'Transaction ID is required' });
        }

        // Fetch transaction
        const transRes = await pool.query(`
            SELECT t.*, b.school_id as book_school_id 
            FROM library_transactions t
            JOIN books b ON t.book_id = b.id
            WHERE t.id = $1 AND t.status = 'Issued'
        `, [transaction_id]);

        if (transRes.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Active transaction not found' });
        }

        const trans = transRes.rows[0];
        if (trans.book_school_id !== schoolId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Calculate actual fine
        const settingsRes = await pool.query('SELECT fine_per_day FROM library_settings WHERE school_id = $1', [schoolId]);
        const finePerDay = settingsRes.rows[0]?.fine_per_day || 5;

        let fine = 0;
        const due = new Date(trans.due_on);
        const today = new Date();
        if (today > due) {
            const diffTime = Math.abs(today - due);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            fine = diffDays * finePerDay;
        }

        await pool.query('BEGIN');

        // Update transaction
        const updatedTrans = await pool.query(`
            UPDATE library_transactions 
            SET status = 'Returned', returned_on = CURRENT_DATE, fine = $1, remarks = $2, condition_on_return = $3
            WHERE id = $4 RETURNING *
        `, [fine, remarks || null, condition || 'Good', transaction_id]);

        // Update book stock
        await pool.query("UPDATE books SET available = available + 1, status = CASE WHEN condition_on_return IN ('Lost', 'Damaged') THEN condition_on_return ELSE 'Available' END WHERE id = $1", [trans.book_id]);

        await pool.query('COMMIT');
        res.status(200).json({ success: true, message: 'Book returned successfully', fine });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to return book' });
    }
};
