const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper for generating random passwords
const generatePassword = () => Math.random().toString(36).slice(-8);

exports.applyForAdmission = async (req, res) => {
    try {
        const { 
            student_name, dob, gender, blood_group, category, aadhaar_number,
            father_name, father_occupation, mother_name, mother_occupation,
            phone, alternate_phone, email, class_applied_for,
            address, city, state, pincode, transport_required, previous_school 
        } = req.body;
        
        const result = await pool.query(
            `INSERT INTO admission_requests 
            (student_name, dob, gender, blood_group, category, aadhaar_number,
            father_name, father_occupation, mother_name, mother_occupation,
            phone, alternate_phone, email, class_applied_for,
            address, city, state, pincode, transport_required, previous_school) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
            [
                student_name, dob, gender, blood_group, category, aadhaar_number,
                father_name, father_occupation, mother_name, mother_occupation,
                phone, alternate_phone, email, class_applied_for,
                address, city, state, pincode, transport_required, previous_school
            ]
        );
        res.status(201).json({ success: true, message: 'Admission request submitted', request: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAdmissionRequests = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, c.name as class_name 
            FROM admission_requests a
            LEFT JOIN classes c ON a.class_applied_for = c.id
            ORDER BY a.created_at DESC
        `);
        res.status(200).json({ success: true, requests: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.approveAdmission = async (req, res) => {
    try {
        const { id } = req.params;
        // Approve request
        const reqResult = await pool.query(
            `UPDATE admission_requests SET status = 'Approved' WHERE id = $1 RETURNING *`,
            [id]
        );
        
        if (reqResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Request not found' });
        
        const request = reqResult.rows[0];
        
        // Fetch fee structures for this class
        const feeResult = await pool.query(`SELECT * FROM fee_structures WHERE class_id = $1`, [request.class_applied_for]);
        
        let total = 0;
        let breakdown = [];
        
        if (feeResult.rows.length > 0) {
            feeResult.rows.forEach(fee => {
                total += parseFloat(fee.amount);
                breakdown.push({ type: fee.fee_type, amount: fee.amount });
            });
        } else {
            // Default fees if not configured
            total = 5000;
            breakdown = [{ type: 'Admission Fee', amount: 5000 }];
        }
        
        // Generate Invoice
        const invResult = await pool.query(
            `INSERT INTO invoices (admission_request_id, total_amount, breakdown) VALUES ($1, $2, $3) RETURNING *`,
            [id, total, JSON.stringify(breakdown)]
        );
        
        res.status(200).json({ success: true, message: 'Approved and invoice generated', invoice: invResult.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params; // This could be the admission_request_id
        const result = await pool.query(`
            SELECT i.*, a.student_name, a.email, a.phone, c.name as class_name 
            FROM invoices i
            JOIN admission_requests a ON i.admission_request_id = a.id
            LEFT JOIN classes c ON a.class_applied_for = c.id
            WHERE i.admission_request_id = $1
        `, [id]);
        
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Invoice not found' });
        
        res.status(200).json({ success: true, invoice: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.processPayment = async (req, res) => {
    try {
        const { admission_request_id } = req.body;
        
        // 1. Update Invoice and Request Status
        await pool.query(`UPDATE invoices SET status = 'Paid' WHERE admission_request_id = $1`, [admission_request_id]);
        const reqResult = await pool.query(`UPDATE admission_requests SET status = 'Paid' WHERE id = $1 RETURNING *`, [admission_request_id]);
        const request = reqResult.rows[0];

        // 2. Generate Users (Student and Parent)
        const studentUsername = 'STU' + Date.now().toString().slice(-6);
        const parentUsername = 'PAR' + Date.now().toString().slice(-6);
        const studentPassword = generatePassword();
        const parentPassword = generatePassword();
        const sHash = await bcrypt.hash(studentPassword, 10);
        const pHash = await bcrypt.hash(parentPassword, 10);

        // Fetch the first school as a default since they didn't specify school id in request
        const schoolResult = await pool.query(`SELECT id FROM schools LIMIT 1`);
        const school_id = schoolResult.rows.length > 0 ? schoolResult.rows[0].id : null;

        // Create Student User
        const sUser = await pool.query(
            `INSERT INTO users (name, username, email, password, role_name, school_id) VALUES ($1, $2, $3, $4, 'Student', $5) RETURNING id`,
            [request.student_name, studentUsername, request.email, sHash, school_id]
        );
        
        const sUserId = sUser.rows[0].id;
        
        // Create Parent User
        // Using a modified email for parent just to avoid unique constraint if they use the same email, but let's assume parent has a separate email. Wait, email is unique.
        const parentEmail = 'p_' + request.email; 
        
        const pUser = await pool.query(
            `INSERT INTO users (name, username, email, phone, password, role_name, school_id) VALUES ($1, $2, $3, $4, $5, 'Parent', $6) RETURNING id`,
            [request.father_name, parentUsername, parentEmail, request.phone, pHash, school_id]
        );
        
        const pUserId = pUser.rows[0].id;

        // Insert into students table
        const admission_no = 'ADM' + Date.now().toString().slice(-6);
        const studentRecord = await pool.query(
            `INSERT INTO students (user_id, school_id, class_id, admission_no, father_name, mother_name, parent_phone) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [sUserId, school_id, request.class_applied_for, admission_no, request.father_name, request.mother_name, request.phone]
        );

        // Insert into parents table
        await pool.query(
            `INSERT INTO parents (user_id, relation, student_id) VALUES ($1, 'Father', $2)`,
            [pUserId, studentRecord.rows[0].id]
        );

        // 3. MOCK SMS/Email Sending
        console.log(`[MOCK SMS] To: ${request.phone}`);
        console.log(`Message: Admission Successful. Student Login - User: ${studentUsername}, Pass: ${studentPassword}. Parent Login - User: ${parentUsername}, Pass: ${parentPassword}`);

        res.status(200).json({ 
            success: true, 
            message: 'Payment successful, credentials sent via SMS (mocked).',
            credentials: {
                student: { username: studentUsername, password: studentPassword },
                parent: { username: parentUsername, password: parentPassword }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getFeeStructures = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT f.*, c.name as class_name, c.section as class_section
            FROM fee_structures f
            JOIN classes c ON f.class_id = c.id
            ORDER BY c.name ASC
        `);
        res.status(200).json({ success: true, fees: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createFeeStructure = async (req, res) => {
    try {
        const { class_id, fee_type, amount } = req.body;
        const result = await pool.query(
            `INSERT INTO fee_structures (class_id, fee_type, amount) VALUES ($1, $2, $3) RETURNING *`,
            [class_id, fee_type, amount]
        );
        res.status(201).json({ success: true, fee: result.rows[0] });
    } catch (error) {
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Fee type already exists for this class.' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM fee_structures WHERE id = $1`, [id]);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
