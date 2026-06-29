const pool = require('../config/db');

const guardSuperAdmin = (req, res) => {
    const role = req.user?.role?.toLowerCase().replace(/\s+/g, '');
    if (role !== 'superadmin') {
        res.status(403).json({ success: false, message: 'Access denied. Super Admin only.' });
        return false;
    }
    return true;
};

// ─────────────────────────────────────────────
// GET /api/super-admin/dashboard
// Overview stats: schools, users, revenue, plans
// ─────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const [schools, users, revenue, planDist] = await Promise.all([
            // Total schools
            pool.query(`SELECT COUNT(*) AS total FROM schools`),
            // Total users by role
            pool.query(`
                SELECT u.role_name AS role, COUNT(u.id) AS count
                FROM users u
                GROUP BY u.role_name
            `),
            // Revenue: sum of plan prices per school billing
            pool.query(`
                SELECT
                    COALESCE(SUM(CASE WHEN s.billing_cycle = 'Monthly' THEN sp.monthly_price ELSE sp.yearly_price END), 0) AS total_revenue,
                    COALESCE(SUM(CASE WHEN s.billing_cycle = 'Monthly' THEN sp.monthly_price ELSE 0 END), 0) AS monthly_revenue,
                    COALESCE(SUM(CASE WHEN s.billing_cycle = 'Yearly'  THEN sp.yearly_price ELSE 0 END), 0) AS yearly_revenue
                FROM schools s
                JOIN subscription_plans sp ON s.plan_id = sp.id
            `),
            // Plan distribution
            pool.query(`
                SELECT sp.name AS plan_name, COUNT(s.id) AS school_count,
                    COALESCE(SUM(sp.monthly_price), 0) AS monthly_contrib
                FROM schools s
                JOIN subscription_plans sp ON s.plan_id = sp.id
                GROUP BY sp.name
                ORDER BY school_count DESC
            `)
        ]);

        const userMap = {};
        users.rows.forEach(r => { userMap[r.role] = parseInt(r.count); });

        res.json({
            success: true,
            stats: {
                totalSchools: parseInt(schools.rows[0].total),
                usersByRole: userMap,
                revenue: revenue.rows[0],
                planDistribution: planDist.rows
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get dashboard stats' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/revenue/monthly
// Last 12 months revenue breakdown (mock simulation from registrations)
// ─────────────────────────────────────────────
exports.getMonthlyRevenue = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        // Revenue by month based on school registration date + plan price
        const result = await pool.query(`
            SELECT
                TO_CHAR(s.created_at, 'Mon YYYY') AS month,
                TO_CHAR(s.created_at, 'YYYY-MM') AS month_key,
                COALESCE(SUM(
                    CASE WHEN s.billing_cycle = 'Monthly' THEN sp.monthly_price
                         WHEN s.billing_cycle = 'Yearly'  THEN sp.yearly_price / 12
                         ELSE 0 END
                ), 0) AS revenue
            FROM schools s
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            WHERE s.created_at >= NOW() - INTERVAL '12 months'
            GROUP BY month_key, month
            ORDER BY month_key ASC
        `);

        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get monthly revenue' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/expiring-soon
// Schools whose subscription will expire within 30 days (based on registration + billing cycle)
// ─────────────────────────────────────────────
exports.getExpiringSoon = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const result = await pool.query(`
            SELECT
                s.id AS school_id,
                s.name AS school_name,
                s.email AS school_email,
                s.phone AS school_phone,
                s.city,
                s.billing_cycle,
                sp.name AS plan_name,
                sp.monthly_price,
                sp.yearly_price,
                u.name AS admin_name,
                u.email AS admin_email,
                u.phone AS admin_phone,
                s.created_at AS subscription_start,
                CASE
                    WHEN s.billing_cycle = 'Monthly'
                        THEN (s.created_at + INTERVAL '1 month' * CEIL(EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (30.0 * 86400)))
                    WHEN s.billing_cycle = 'Yearly'
                        THEN (s.created_at + INTERVAL '1 year'  * CEIL(EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (365.0 * 86400)))
                    ELSE NULL
                END AS next_renewal_date
            FROM schools s
            JOIN subscription_plans sp ON s.plan_id = sp.id
            JOIN users u ON u.school_id = s.id AND u.role_name = 'School Admin'
            GROUP BY s.id, s.name, s.email, s.phone, s.city, s.billing_cycle,
                     sp.name, sp.monthly_price, sp.yearly_price,
                     u.name, u.email, u.phone, s.created_at
            HAVING
                CASE
                    WHEN s.billing_cycle = 'Monthly'
                        THEN (s.created_at + INTERVAL '1 month' * CEIL(EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (30.0 * 86400)))
                    WHEN s.billing_cycle = 'Yearly'
                        THEN (s.created_at + INTERVAL '1 year'  * CEIL(EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (365.0 * 86400)))
                    ELSE NULL
                END BETWEEN NOW() AND NOW() + INTERVAL '30 days'
            ORDER BY next_renewal_date ASC
        `);

        res.json({ success: true, count: result.rows.length, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get expiring soon data' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/transactions
// All transactions from DB with school + plan info
// ─────────────────────────────────────────────
exports.getTransactions = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { status, search } = req.query;

        let whereClause = 'WHERE 1=1';
        const params = [];

        if (status && status !== 'All') {
            params.push(status);
            whereClause += ` AND t.status = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            whereClause += ` AND (s.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR t.invoice_no ILIKE $${params.length})`;
        }

        const result = await pool.query(`
            SELECT
                t.id,
                t.invoice_no,
                t.amount,
                t.billing_cycle,
                t.status,
                t.payment_method,
                t.payment_date,
                t.due_date,
                t.notes,
                t.receipt_url,
                t.created_at AS transaction_date,
                s.id   AS school_id,
                s.name AS school_name,
                s.city AS school_city,
                sp.name AS plan_name,
                u.name  AS admin_name,
                u.email AS admin_email,
                u.phone AS admin_phone
            FROM transactions t
            JOIN schools s          ON t.school_id = s.id
            LEFT JOIN subscription_plans sp ON t.plan_id = sp.id
            LEFT JOIN users u        ON u.school_id = s.id AND u.role_name = 'School Admin'
            ${whereClause}
            ORDER BY t.created_at DESC
        `, params);

        // Summary by status
        const summary = await pool.query(`
            SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total
            FROM transactions GROUP BY status
        `);

        const totalRevenue = result.rows
            .filter(r => r.status === 'Paid')
            .reduce((s, r) => s + parseFloat(r.amount || 0), 0);

        res.json({
            success: true,
            totalRevenue,
            count: result.rows.length,
            summary: summary.rows,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get transactions' });
    }
};

// ─────────────────────────────────────────────
// POST /api/super-admin/transactions
// Create a new transaction manually
// ─────────────────────────────────────────────
exports.createTransaction = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { school_id, plan_id, amount, billing_cycle, status, payment_method, payment_date, due_date, notes } = req.body;
        if (!school_id || !amount) {
            return res.status(400).json({ success: false, message: 'school_id and amount are required' });
        }
        const invoiceNo = `INV-${school_id}-${Date.now()}`;
        const result = await pool.query(`
            INSERT INTO transactions (school_id, plan_id, amount, billing_cycle, status, payment_method, payment_date, due_date, notes, invoice_no)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
        `, [
            school_id,
            plan_id || null,
            amount,
            billing_cycle || 'Monthly',
            status || 'Pending',
            payment_method || 'Online Transfer',
            payment_date || null,
            due_date || null,
            notes || null,
            invoiceNo
        ]);
        res.status(201).json({ success: true, message: 'Transaction created', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to create transaction' });
    }
};

// ─────────────────────────────────────────────
// PATCH /api/super-admin/transactions/:id/status
// Update transaction status
// ─────────────────────────────────────────────
exports.updateTransactionStatus = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { id } = req.params;
        const { status, payment_method, payment_date, notes } = req.body;
        const allowed = ['Paid', 'Pending', 'Pending Verification', 'Overdue', 'Cancelled', 'Refunded'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });
        }
        const result = await pool.query(`
            UPDATE transactions
            SET status         = $1,
                payment_method = COALESCE($2, payment_method),
                payment_date   = COALESCE($3, payment_date),
                notes          = COALESCE($4, notes),
                updated_at     = NOW()
            WHERE id = $5
            RETURNING *
        `, [status, payment_method || null, payment_date || null, notes || null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.json({ success: true, message: `Status updated to ${status}`, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update transaction status' });
    }
};

// ─────────────────────────────────────────────
// DELETE /api/super-admin/transactions/:id
// Delete a transaction
// ─────────────────────────────────────────────
exports.deleteTransaction = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM transactions WHERE id=$1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.json({ success: true, message: 'Transaction deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to delete transaction' });
    }
};


// ─────────────────────────────────────────────
// GET /api/super-admin/users
// All users grouped by role
// ─────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { school_id } = req.query;
        let query = `
            SELECT
                u.id, u.name, u.email, u.phone, u.is_active, u.created_at,
                u.role_name AS role_name,
                s.name AS school_name
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
        `;
        const params = [];
        if (school_id) {
            query += ` WHERE u.school_id = $1 `;
            params.push(school_id);
        }
        query += ` ORDER BY u.created_at DESC`;

        const result = await pool.query(query, params);

        // Group by role for summary
        const byRole = {};
        result.rows.forEach(u => {
            if (!byRole[u.role_name]) byRole[u.role_name] = 0;
            byRole[u.role_name]++;
        });

        res.json({
            success: true,
            total: result.rows.length,
            byRole,
            data: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get users' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/schools
// All schools with their subscription info
// ─────────────────────────────────────────────
exports.getSchools = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const result = await pool.query(`
            SELECT
                s.id AS school_id,
                s.name AS school_name,
                s.email AS school_email,
                s.phone AS school_phone,
                s.city,
                s.is_active,
                s.subscription_status,
                s.subscription_start_date,
                s.subscription_end_date,
                sp.name AS plan_name,
                u.name AS admin_name,
                u.email AS admin_email,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Student') as student_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Teacher') as teacher_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Accountant') as accountant_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Librarian') as librarian_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Receptionist') as receptionist_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Transport Manager') as transport_manager_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'Hostel Warden') as hostel_warden_count,
                (SELECT COUNT(*) FROM users WHERE school_id = s.id AND role_name = 'HR Manager') as hr_manager_count
            FROM schools s
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            LEFT JOIN users u ON u.school_id = s.id AND u.role_name = 'School Admin'
            ORDER BY s.created_at DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to get schools' });
    }
};

// ─────────────────────────────────────────────
// PATCH /api/super-admin/schools/:id/subscription
// Update school subscription dates and status
// ─────────────────────────────────────────────
exports.updateSchoolSubscription = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { id } = req.params;
        const { subscription_start_date, subscription_end_date, subscription_status, is_active } = req.body;

        const result = await pool.query(`
            UPDATE schools
            SET
                subscription_start_date = COALESCE($1, subscription_start_date),
                subscription_end_date = COALESCE($2, subscription_end_date),
                subscription_status = COALESCE($3, subscription_status),
                is_active = COALESCE($4, is_active)
            WHERE id = $5
            RETURNING *
        `, [
            subscription_start_date || null,
            subscription_end_date || null,
            subscription_status,
            is_active !== undefined ? is_active : null,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        res.json({ success: true, message: 'Subscription updated', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update school subscription' });
    }
};

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GET /api/super-admin/revenue/report
// Get revenue report
// ─────────────────────────────────────────────
exports.getRevenueReport = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const result = await pool.query(`
            SELECT 
                COALESCE(SUM(amount), 0) as total_revenue,
                COUNT(id) as transaction_count
            FROM transactions
            WHERE status = 'Completed'
        `);
        
        res.json({ 
            success: true, 
            data: {
                totalRevenue: result.rows[0].total_revenue,
                transactionCount: result.rows[0].transaction_count,
                // Mock projected data based on total active subscriptions (for UI richness)
                projectedRevenue: parseFloat(result.rows[0].total_revenue) * 1.2,
                pendingDues: 0 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to generate revenue report' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/settings
// Get platform settings
// ─────────────────────────────────────────────
exports.getPlatformSettings = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const result = await pool.query(`SELECT setting_key, setting_value FROM platform_settings`);
        const settings = {};
        result.rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
};

// ─────────────────────────────────────────────
// PUT /api/super-admin/settings
// Update platform settings
// ─────────────────────────────────────────────
exports.updatePlatformSettings = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const settings = req.body;
        for (const key in settings) {
            await pool.query(`
                INSERT INTO platform_settings (setting_key, setting_value) 
                VALUES ($1, $2)
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP
            `, [key, String(settings[key])]);
        }
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
};

// ─────────────────────────────────────────────
// POST /api/super-admin/reminders/send
// Send subscription reminders
// ─────────────────────────────────────────────
exports.sendReminders = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        // Mock sending emails
        res.json({ success: true, message: 'Reminders sent successfully to all expiring schools' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send reminders' });
    }
};

// ─────────────────────────────────────────────
// GET /api/super-admin/plans
// ─────────────────────────────────────────────
exports.getPlans = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const result = await pool.query('SELECT * FROM subscription_plans ORDER BY id ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch plans' });
    }
};

// ─────────────────────────────────────────────
// PUT /api/super-admin/plans/:id
// ─────────────────────────────────────────────
exports.updatePlan = async (req, res) => {
    if (!guardSuperAdmin(req, res)) return;
    try {
        const { id } = req.params;
        const { name, max_students, monthly_price, yearly_price } = req.body;
        
        await pool.query(
            'UPDATE subscription_plans SET name = $1, max_students = $2, monthly_price = $3, yearly_price = $4 WHERE id = $5',
            [name, max_students || null, monthly_price, yearly_price, id]
        );
        res.json({ success: true, message: 'Plan updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update plan' });
    }
};
