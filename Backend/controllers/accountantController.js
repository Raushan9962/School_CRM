const pool = require('../config/db');

// --- DASHBOARD ---
exports.getDashboardStats = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        // Today's Collection
        const todayCollectionResult = await pool.query(
            "SELECT COALESCE(SUM(amount_paid), 0) as total FROM fee_receipts WHERE school_id = $1 AND payment_date = CURRENT_DATE AND status = 'Paid'",
            [schoolId]
        );

        // This Month Collection
        const monthCollectionResult = await pool.query(
            "SELECT COALESCE(SUM(amount_paid), 0) as total FROM fee_receipts WHERE school_id = $1 AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND status = 'Paid'",
            [schoolId]
        );

        // Today's Expenses
        const todayExpenseResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE school_id = $1 AND date = CURRENT_DATE",
            [schoolId]
        );
        
        // Total Expenses
        const totalExpenseResult = await pool.query(
            "SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE school_id = $1",
            [schoolId]
        );

        // Pending Fees
        const pendingFeesResult = await pool.query(
            "SELECT COALESCE(SUM(balance), 0) as total FROM fee_receipts WHERE school_id = $1",
            [schoolId]
        );
        
        // Salary Paid
        const salaryPaidResult = await pool.query(
            "SELECT COALESCE(SUM(net_salary), 0) as total FROM payrolls WHERE school_id = $1 AND status = 'Paid'",
            [schoolId]
        );
        
        // Salary Pending
        const salaryPendingResult = await pool.query(
            "SELECT COALESCE(SUM(net_salary), 0) as total FROM payrolls WHERE school_id = $1 AND status = 'Pending'",
            [schoolId]
        );

        // Defaulters Count
        const defaultersResult = await pool.query(
            "SELECT COUNT(DISTINCT student_id) as count FROM fee_receipts WHERE school_id = $1 AND balance > 0",
            [schoolId]
        );

        // Recent Transactions (Last 5 fee collections)
        const recentTransactionsResult = await pool.query(
            "SELECT receipt_number as id, 'Fee Collection' as type, amount_paid as amount, payment_date as date, payment_mode as mode FROM fee_receipts WHERE school_id = $1 AND status = 'Paid' ORDER BY payment_date DESC LIMIT 5",
            [schoolId]
        );

        res.json({
            success: true,
            data: {
                todaysCollection: todayCollectionResult.rows[0].total,
                thisMonthCollection: monthCollectionResult.rows[0].total,
                todaysExpenses: todayExpenseResult.rows[0].total,
                totalExpenses: totalExpenseResult.rows[0].total,
                pendingFees: pendingFeesResult.rows[0].total,
                salaryPaid: salaryPaidResult.rows[0].total,
                salaryPending: salaryPendingResult.rows[0].total,
                defaultersCount: defaultersResult.rows[0].count,
                recentTransactions: recentTransactionsResult.rows,
            }
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: err.message, stack: err.stack });
    }
};

// --- FEE COLLECTION ---
exports.collectFee = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { studentId, paymentMode, totalAmount, amountPaid, transactionId } = req.body;
        const schoolId = req.user.schoolId;
        const receiptNumber = `REC${Date.now()}`;
        const balance = totalAmount - amountPaid;
        const status = balance <= 0 ? 'Paid' : 'Partial';

        const result = await client.query(
            `INSERT INTO fee_receipts (school_id, receipt_number, student_id, payment_mode, transaction_id, total_amount, amount_paid, balance, status, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [schoolId, receiptNumber, studentId, paymentMode, transactionId, totalAmount, amountPaid, balance, status, req.user.userId]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: "Fee collected successfully", data: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Fee Collection Error:", err);
        res.status(500).json({ success: false, message: "Failed to collect fee" });
    } finally {
        client.release();
    }
};

exports.getFeeReceipts = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT f.*, s.name as student_name, s.admission_no 
            FROM fee_receipts f
            JOIN students s ON f.student_id = s.id
            WHERE f.school_id = $1
            ORDER BY f.created_at DESC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Fetch Receipts Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch receipts" });
    }
};

// --- EXPENSES ---
exports.addExpense = async (req, res) => {
    try {
        const { category, amount, expenseDate, vendorId, description, billUrl } = req.body;
        const schoolId = req.user.schoolId;

        const result = await pool.query(
            `INSERT INTO expenses (school_id, category, amount, expense_date, vendor_id, description, bill_url, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [schoolId, category, amount, expenseDate, vendorId, description, billUrl, req.user.userId]
        );
        res.json({ success: true, message: "Expense recorded successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).json({ success: false, message: "Failed to add expense" });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(
            "SELECT * FROM expenses WHERE school_id = $1 ORDER BY expense_date DESC",
            [schoolId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch expenses" });
    }
};

// --- PAYROLL ---
exports.generatePayroll = async (req, res) => {
    try {
        const { staffId, month, year, basicSalary, allowances, deductions, paymentDate } = req.body;
        const schoolId = req.user.schoolId;
        const netSalary = basicSalary + allowances - deductions;

        const result = await pool.query(
            `INSERT INTO payrolls (school_id, staff_id, month, year, basic_salary, allowances, deductions, net_salary, payment_date, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Paid') RETURNING *`,
            [schoolId, staffId, month, year, basicSalary, allowances, deductions, netSalary, paymentDate]
        );
        res.json({ success: true, message: "Payroll generated successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Payroll Error:", err);
        res.status(500).json({ success: false, message: "Failed to generate payroll" });
    }
};

exports.getPayrolls = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT p.*, u.name as staff_name, u.role_name as role
            FROM payrolls p
            JOIN users u ON p.staff_id = u.id
            WHERE p.school_id = $1
            ORDER BY p.created_at DESC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch payrolls" });
    }
};

// --- CRM SUPER ADMIN PAYMENTS ---
exports.recordCRMSubscription = async (req, res) => {
    try {
        const { planId, amount, paymentDate, paymentMode, transactionId, billingCycle } = req.body;
        const schoolId = req.user.schoolId;
        const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO transactions (school_id, plan_id, amount, billing_cycle, status, payment_method, payment_date, invoice_no, receipt_url)
             VALUES ($1, $2, $3, $4, 'Pending Verification', $5, $6, $7, $8) RETURNING *`,
            [schoolId, planId, amount, billingCycle || 'Monthly', paymentMode, paymentDate, transactionId || `TXN-${Date.now()}`, receiptUrl]
        );
        res.json({ success: true, message: "Subscription payment recorded and pending verification", data: result.rows[0] });
    } catch (err) {
        console.error("CRM Payment Error:", err);
        res.status(500).json({ success: false, message: "Failed to record CRM payment" });
    }
};

exports.getCRMSubscriptions = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        // Fetch payments
        const paymentResult = await pool.query(
            "SELECT * FROM transactions WHERE school_id = $1 ORDER BY created_at DESC",
            [schoolId]
        );

        // Fetch plan details for the school
        const planResult = await pool.query(`
            SELECT s.billing_cycle, s.subscription_status, sp.name as plan_name, sp.max_students, sp.monthly_price, sp.yearly_price
            FROM schools s
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            WHERE s.id = $1
        `, [schoolId]);

        res.json({ 
            success: true, 
            data: paymentResult.rows,
            planDetails: planResult.rows[0] || null
        });
    } catch (err) {
        console.error("Fetch CRM Payments Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch CRM payments" });
    }
};

// --- VENDOR MANAGEMENT ---
exports.getVendors = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query('SELECT * FROM vendors WHERE school_id = $1 ORDER BY name ASC', [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Vendors Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch vendors" });
    }
};

exports.addVendor = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { name, type, contact, email, pending_due } = req.body;
        const result = await pool.query(
            `INSERT INTO vendors (school_id, name, type, contact, email, pending_due)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [schoolId, name, type, contact, email, pending_due || 0]
        );
        res.json({ success: true, message: "Vendor added successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Add Vendor Error:", err);
        res.status(500).json({ success: false, message: "Failed to add vendor", error: err.message });
    }
};

exports.payVendor = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const vendorId = req.params.id;
        const { amount, paymentDate, paymentMethod } = req.body;
        
        await pool.query('BEGIN');
        
        // Add payment
        await pool.query(
            `INSERT INTO vendor_payments (school_id, vendor_id, amount, payment_date, payment_method, created_by)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [schoolId, vendorId, amount, paymentDate, paymentMethod, req.user.userId]
        );

        // Deduct from pending due
        const result = await pool.query(
            `UPDATE vendors SET pending_due = pending_due - $1 WHERE id = $2 AND school_id = $3 RETURNING *`,
            [amount, vendorId, schoolId]
        );
        
        await pool.query('COMMIT');
        res.json({ success: true, message: "Vendor payment recorded successfully", data: result.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Pay Vendor Error:", err);
        res.status(500).json({ success: false, message: "Failed to record vendor payment" });
    }
};

// --- SCHOLARSHIPS & DISCOUNTS ---
exports.getScholarships = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT sd.*, u.name as student_name, u.admission_number as student_roll
            FROM scholarships_discounts sd
            JOIN users u ON sd.student_id = u.id
            WHERE sd.school_id = $1
            ORDER BY sd.created_at DESC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Scholarships Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch scholarships" });
    }
};

exports.assignScholarship = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { studentId, grantType, valueType, value, validTill, remarks } = req.body;

        // Verify student belongs to this school
        const studentCheck = await pool.query('SELECT id FROM users WHERE id = $1 AND school_id = $2 AND role_name = $3', [studentId, schoolId, 'Student']);
        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found in your school" });
        }

        const result = await pool.query(
            `INSERT INTO scholarships_discounts (school_id, student_id, grant_type, value_type, value, valid_till, remarks, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [schoolId, studentId, grantType, valueType, value, validTill, remarks, req.user.userId]
        );
        res.json({ success: true, message: "Scholarship assigned successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Assign Scholarship Error:", err);
        res.status(500).json({ success: false, message: "Failed to assign scholarship" });
    }
};

exports.updateScholarshipStatus = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { id } = req.params;
        const { status } = req.body;
        
        const result = await pool.query(
            `UPDATE scholarships_discounts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND school_id = $3 RETURNING *`,
            [status, id, schoolId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Scholarship not found" });
        }
        res.json({ success: true, message: "Status updated successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Update Scholarship Status Error:", err);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

// --- STUDENTS ---
exports.getStudents = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT id, name, email, admission_number, class_name, section 
            FROM users 
            WHERE school_id = $1 AND role_name = 'Student'
            ORDER BY name ASC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch students" });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT id, name, section, class_teacher_id
            FROM classes
            WHERE school_id = $1
            ORDER BY name ASC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Classes Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch classes" });
    }
};

// --- STUDENT FEE MANAGEMENT ---
exports.getFeeStructures = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(
            "SELECT * FROM fee_structures WHERE school_id = $1 ORDER BY created_at DESC",
            [schoolId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Fee Structures Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch fee structures" });
    }
};

exports.addFeeStructure = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { name, className, totalAmount } = req.body;
        const result = await pool.query(
            `INSERT INTO fee_structures (school_id, name, class_name, total_amount, created_by)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [schoolId, name, className, totalAmount, req.user.userId]
        );
        res.json({ success: true, message: "Fee structure added successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Add Fee Structure Error:", err);
        res.status(500).json({ success: false, message: "Failed to add fee structure" });
    }
};

exports.getStudentFees = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT sfi.*, u.name as student_name, u.admission_number, u.father_name, u.class_name, fs.name as fee_type, fs.total_amount
            FROM student_fee_invoices sfi
            JOIN users u ON sfi.student_id = u.id
            JOIN fee_structures fs ON sfi.fee_structure_id = fs.id
            WHERE sfi.school_id = $1
            ORDER BY sfi.created_at DESC
        `, [schoolId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Get Student Fees Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch student fees" });
    }
};

exports.assignStudentFee = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { studentId, feeStructureId } = req.body;

        // Verify student and fee structure
        const structureCheck = await pool.query("SELECT * FROM fee_structures WHERE id = $1 AND school_id = $2", [feeStructureId, schoolId]);
        if (structureCheck.rows.length === 0) return res.status(404).json({ success: false, message: "Fee structure not found" });
        const feeStructure = structureCheck.rows[0];

        const studentCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND school_id = $2 AND role_name = 'Student'", [studentId, schoolId]);
        if (studentCheck.rows.length === 0) return res.status(404).json({ success: false, message: "Student not found" });

        const result = await pool.query(
            `INSERT INTO student_fee_invoices (school_id, student_id, fee_structure_id, due_amount, assigned_by)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [schoolId, studentId, feeStructureId, feeStructure.total_amount, req.user.userId]
        );
        res.json({ success: true, message: "Fee assigned successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Assign Student Fee Error:", err);
        res.status(500).json({ success: false, message: "Failed to assign fee" });
    }
};

exports.bulkGenerateStudentFees = async (req, res) => {
    const client = await pool.connect();
    try {
        const schoolId = req.user.schoolId;
        const { className, feeStructureId } = req.body;

        const structureCheck = await client.query("SELECT * FROM fee_structures WHERE id = $1 AND school_id = $2", [feeStructureId, schoolId]);
        if (structureCheck.rows.length === 0) return res.status(404).json({ success: false, message: "Fee structure not found" });
        const feeStructure = structureCheck.rows[0];

        let studentsQuery = "SELECT id FROM users WHERE school_id = $1 AND role_name = 'Student'";
        let queryParams = [schoolId];
        
        if (className && className !== 'All Classes') {
            studentsQuery += " AND class_name = $2";
            queryParams.push(className);
        }
        
        const students = await client.query(studentsQuery, queryParams);
        if (students.rows.length === 0) {
            return res.json({ success: false, message: "No students found in the selected class" });
        }

        await client.query('BEGIN');
        
        let generatedCount = 0;
        for (let student of students.rows) {
            // Check if already assigned
            const existingCheck = await client.query(
                "SELECT id FROM student_fee_invoices WHERE student_id = $1 AND fee_structure_id = $2",
                [student.id, feeStructureId]
            );
            
            if (existingCheck.rows.length === 0) {
                await client.query(
                    `INSERT INTO student_fee_invoices (school_id, student_id, fee_structure_id, due_amount, assigned_by)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [schoolId, student.id, feeStructureId, feeStructure.total_amount, req.user.userId]
                );
                generatedCount++;
            }
        }
        
        await client.query('COMMIT');
        res.json({ success: true, message: `Successfully generated ${generatedCount} invoices.` });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Bulk Generate Error:", err);
        res.status(500).json({ success: false, message: "Failed to generate invoices" });
    } finally {
        client.release();
    }
};
