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
        const { planId, amount, paymentDate, paymentMode, transactionId, invoiceUrl } = req.body;
        const schoolId = req.user.schoolId;

        const result = await pool.query(
            `INSERT INTO crm_subscription_payments (school_id, plan_id, amount, payment_date, payment_mode, transaction_id, invoice_url, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [schoolId, planId, amount, paymentDate, paymentMode, transactionId, invoiceUrl, req.user.userId]
        );
        res.json({ success: true, message: "CRM payment recorded successfully", data: result.rows[0] });
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
            "SELECT * FROM crm_subscription_payments WHERE school_id = $1 ORDER BY payment_date DESC",
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
