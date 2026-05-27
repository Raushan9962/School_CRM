const pool = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const stats = {
            totalSchools: 0,
            totalStudents: 0,
            estimatedMonthlyRevenue: 0
        };

        // Get total schools and revenue
        const schoolsQuery = await pool.query(`
            SELECT 
                COUNT(*) as total_schools,
                COALESCE(SUM(CASE WHEN s.billing_cycle = 'Monthly' THEN p.monthly_price ELSE p.yearly_price / 12 END), 0) as monthly_revenue
            FROM schools s
            LEFT JOIN subscription_plans p ON s.plan_id = p.id
            WHERE s.subscription_status = 'Active'
        `);
        
        if (schoolsQuery.rows.length > 0) {
            stats.totalSchools = parseInt(schoolsQuery.rows[0].total_schools);
            stats.estimatedMonthlyRevenue = parseFloat(schoolsQuery.rows[0].monthly_revenue).toFixed(2);
        }

        // Get total active students across all schools
        const studentsQuery = await pool.query(`SELECT COUNT(*) as total_students FROM students`);
        stats.totalStudents = parseInt(studentsQuery.rows[0].total_students);

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

exports.getSchoolsList = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, s.name, s.email, s.phone, s.city, s.subscription_status, s.billing_cycle, s.created_at,
                p.name as plan_name, p.max_students, p.monthly_price, p.yearly_price,
                (SELECT COUNT(*) FROM students st WHERE st.school_id = s.id) as current_students
            FROM schools s
            LEFT JOIN subscription_plans p ON s.plan_id = p.id
            ORDER BY s.created_at DESC
        `;
        const result = await pool.query(query);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching schools list:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch schools list' });
    }
};
