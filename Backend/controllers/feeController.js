const Fee = require('../models/Fee');
const pool = require('../config/db');

exports.createFee = async (req, res) => {
    try {
        const result = await Fee.create(req.body);
        res.status(201).json({ message: 'Fee created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating fee' });
    }
};

exports.getAllFees = async (req, res) => {
    try {
        const results = await Fee.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getFeeById = async (req, res) => {
    try {
        const result = await Fee.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Fee not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getFeesByStudentId = async (req, res) => {
    try {
        const userId = req.params.studentId;
        const result = await pool.query(`
            SELECT concat('old_', f.id) as id, f.due_date, 'General Fee' as description, f.status, f.amount, f.paid_date, f.payment_method, f.transaction_ref 
            FROM fees f
            JOIN students s ON f.student_id = s.id
            WHERE s.user_id = $1
            
            UNION ALL
            
            SELECT concat('new_', sfi.id) as id, sfi.created_at as due_date, fs.fee_type as description, sfi.status, sfi.due_amount as amount, sfi.updated_at as paid_date, sfi.payment_method, sfi.transaction_ref
            FROM student_fee_invoices sfi
            JOIN fee_structures fs ON sfi.fee_structure_id = fs.id
            WHERE sfi.student_id = $1
            
            ORDER BY due_date DESC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student fees' });
    }
};

exports.updateFee = async (req, res) => {
    try {
        const idStr = req.params.id;
        
        if (idStr.startsWith('new_')) {
            const actualId = idStr.replace('new_', '');
            const { status, paid_date, payment_method, transaction_ref } = req.body;
            // For new system, when marked Paid, also update paid_amount
            const result = await pool.query(
                `UPDATE student_fee_invoices 
                 SET status = $1, paid_amount = CASE WHEN $1 = 'Paid' THEN due_amount ELSE paid_amount END, updated_at = $2, payment_method = $3, transaction_ref = $4 
                 WHERE id = $5 RETURNING *`,
                [status, paid_date || new Date(), payment_method || null, transaction_ref || null, actualId]
            );
            if (result.rows.length === 0) return res.status(404).json({ error: 'Fee not found' });
            return res.status(200).json({ message: 'Fee updated successfully', data: result.rows[0] });
        } else if (idStr.startsWith('old_')) {
            const actualId = idStr.replace('old_', '');
            const result = await Fee.update(actualId, req.body);
            if (!result) return res.status(404).json({ error: 'Fee not found' });
            return res.status(200).json({ message: 'Fee updated successfully', data: result });
        } else {
            // Fallback for standard integer IDs
            const result = await Fee.update(idStr, req.body);
            if (!result) return res.status(404).json({ error: 'Fee not found' });
            return res.status(200).json({ message: 'Fee updated successfully', data: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating fee' });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        const result = await Fee.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Fee not found' });
        res.status(200).json({ message: 'Fee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting fee' });
    }
};
