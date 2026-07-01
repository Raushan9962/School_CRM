const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper for generating random passwords
const generatePassword = () => Math.random().toString(36).slice(-8);

exports.applyForAdmission = async (req, res) => {
    try {
        const { 
            student_name, dob, gender, blood_group, category, aadhaar_number,
            father_name, mother_name, guardian_name, parent_occupation, parent_income,
            phone, alternate_phone, email, class_applied_for,
            address, city, state, pincode, previous_school, board, religion,
            medical_allergies, medical_disabilities, medical_doctor_name, emergency_contact,
            transport_required, transport_route_id, transport_stop, transport_pass_number,
            hostel_required, hostel_block, hostel_room, hostel_bed
        } = req.body;
        
        const result = await pool.query(
            `INSERT INTO admission_requests 
            (student_name, dob, gender, blood_group, category, aadhaar_number,
            father_name, mother_name, guardian_name, parent_occupation, parent_income,
            phone, alternate_phone, email, class_applied_for,
            address, city, state, pincode, previous_school, board, religion,
            medical_allergies, medical_disabilities, medical_doctor_name, emergency_contact,
            transport_required, transport_route_id, transport_stop, transport_pass_number,
            hostel_required, hostel_block, hostel_room, hostel_bed) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) RETURNING *`,
            [
                student_name, dob, gender, blood_group, category, aadhaar_number,
                father_name, mother_name, guardian_name, parent_occupation, parent_income,
                phone, alternate_phone, email, class_applied_for,
                address, city, state, pincode, previous_school, board, religion,
                medical_allergies, medical_disabilities, medical_doctor_name, emergency_contact,
                transport_required, transport_route_id, transport_stop, transport_pass_number,
                hostel_required, hostel_block, hostel_room, hostel_bed
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
        if (feeResult.rows.length > 0) {
            feeResult.rows.forEach(fee => { total += parseFloat(fee.amount); });
        } else {
            total = 5000;
        }
        
        // Fetch the first school as a default since they didn't specify school id in request
        const schoolResult = await pool.query(`SELECT id FROM schools LIMIT 1`);
        const school_id = schoolResult.rows.length > 0 ? schoolResult.rows[0].id : null;

        // Parent Check & Create
        const existingParentQuery = await pool.query(
            `SELECT id, username FROM users WHERE role_name = 'Parent' AND (email = $1 OR phone = $2) LIMIT 1`,
            [request.email, request.phone]
        );
        let pUserId = null;
        let parentUsername = null;
        let parentPassword = null;
        let isNewParent = false;

        if (existingParentQuery.rows.length > 0) {
            pUserId = existingParentQuery.rows[0].id;
            parentUsername = existingParentQuery.rows[0].username;
        } else {
            isNewParent = true;
            parentUsername = 'PAR' + Date.now().toString().slice(-6);
            parentPassword = generatePassword();
            const pHash = await bcrypt.hash(parentPassword, 10);
            const parentEmail = request.email ? 'p_' + request.email : null; 
            
            const pUser = await pool.query(
                `INSERT INTO users (name, username, email, phone, password, role_name, school_id) VALUES ($1, $2, $3, $4, $5, 'Parent', $6) RETURNING id`,
                [request.father_name || request.guardian_name || 'Parent', parentUsername, parentEmail, request.phone, pHash, school_id]
            );
            pUserId = pUser.rows[0].id;
        }

        // Create Student User
        const studentUsername = 'STU' + Date.now().toString().slice(-6);
        const studentPassword = generatePassword();
        const sHash = await bcrypt.hash(studentPassword, 10);

        const sUser = await pool.query(
            `INSERT INTO users (name, username, email, password, role_name, school_id) VALUES ($1, $2, $3, $4, 'Student', $5) RETURNING id`,
            [request.student_name, studentUsername, request.email, sHash, school_id]
        );
        const sUserId = sUser.rows[0].id;

        // Insert into students table
        const admission_no = 'ADM' + Date.now().toString().slice(-6);
        const studentRecord = await pool.query(
            `INSERT INTO students (
                user_id, school_id, class_id, admission_no, father_name, mother_name, parent_phone,
                religion, guardian_name, parent_occupation, parent_income, board, 
                medical_allergies, medical_disabilities, medical_doctor_name, emergency_contact, 
                transport_route_id, transport_stop, transport_pass_number, 
                hostel_block, hostel_room, hostel_bed, transport_required, parent_email, category
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) RETURNING id`,
            [
                sUserId, school_id, request.class_applied_for, admission_no, request.father_name, request.mother_name, request.phone,
                request.religion, request.guardian_name, request.parent_occupation, request.parent_income, request.board,
                request.medical_allergies, request.medical_disabilities, request.medical_doctor_name, request.emergency_contact,
                request.transport_route_id, request.transport_stop, request.transport_pass_number,
                request.hostel_block, request.hostel_room, request.hostel_bed, request.transport_required, request.email, request.category
            ]
        );

        // Insert into parents table
        await pool.query(
            `INSERT INTO parents (user_id, relation, student_id) VALUES ($1, 'Father', $2)`,
            [pUserId, studentRecord.rows[0].id]
        );

        // Assign pending fee
        let feeStructureQuery = await pool.query(`SELECT id FROM fee_structures WHERE class_id = $1 AND fee_type = 'Admission Fee'`, [request.class_applied_for]);
        let feeStructureId = null;

        if (feeStructureQuery.rows.length > 0) {
            feeStructureId = feeStructureQuery.rows[0].id;
        } else {
            const newFeeStruct = await pool.query(
                `INSERT INTO fee_structures (class_id, fee_type, amount) VALUES ($1, 'Admission Fee', $2) RETURNING id`,
                [request.class_applied_for, total]
            );
            feeStructureId = newFeeStruct.rows[0].id;
        }

        await pool.query(
            `INSERT INTO student_fee_invoices (school_id, student_id, fee_structure_id, due_amount, paid_amount, status) 
             VALUES ($1, $2, $3, $4, 0, 'Pending')`,
            [school_id, studentRecord.rows[0].id, feeStructureId, total]
        );

        // MOCK SMS/Email Sending
        if (isNewParent) {
            console.log(`[MOCK EMAIL/SMS] To: ${request.phone}`);
            console.log(`Message: Admission Approved! Student Login - User: ${studentUsername}, Pass: ${studentPassword} | Parent Login - User: ${parentUsername}, Pass: ${parentPassword}`);
        } else {
            console.log(`[MOCK EMAIL/SMS] To: ${request.phone}`);
            console.log(`Message: Sibling Admission Approved! Student Login - User: ${studentUsername}, Pass: ${studentPassword}. Your existing Parent account applies.`);
        }
        
        let credentialsObj = {
            student: { username: studentUsername, password: studentPassword }
        };
        if (isNewParent) {
            credentialsObj.parent = { username: parentUsername, password: parentPassword };
        } else {
            credentialsObj.parent = { username: parentUsername, password: ' (Existing Password)' };
        }

        res.status(200).json({ 
            success: true, 
            message: 'Approved, pending fee added, and users created', 
            credentials: credentialsObj
        });
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
        
        // Update Invoice and Request Status
        await pool.query(`UPDATE invoices SET status = 'Paid' WHERE admission_request_id = $1`, [admission_request_id]);
        await pool.query(`UPDATE admission_requests SET status = 'Paid' WHERE id = $1 RETURNING *`, [admission_request_id]);

        res.status(200).json({ 
            success: true, 
            message: 'Payment successful.'
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
    const client = await pool.connect();
    try {
        const { class_id, fee_type, amount } = req.body;

        if (class_id === 'ALL') {
            await client.query('BEGIN');
            const classesRes = await client.query('SELECT id FROM classes');
            
            for (let c of classesRes.rows) {
                const existing = await client.query('SELECT id FROM fee_structures WHERE class_id = $1 AND fee_type = $2', [c.id, fee_type]);
                if (existing.rows.length === 0) {
                    await client.query(
                        `INSERT INTO fee_structures (class_id, fee_type, amount) VALUES ($1, $2, $3)`,
                        [c.id, fee_type, amount]
                    );
                }
            }
            
            await client.query('COMMIT');
            res.status(201).json({ success: true, message: 'Fee structure applied to all classes successfully.' });
        } else {
            const result = await pool.query(
                `INSERT INTO fee_structures (class_id, fee_type, amount) VALUES ($1, $2, $3) RETURNING *`,
                [class_id, fee_type, amount]
            );
            res.status(201).json({ success: true, fee: result.rows[0] });
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Fee type already exists for this class.' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        client.release();
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

exports.updateFeeStructure = async (req, res) => {
    try {
        const { id } = req.params;
        const { fee_type, amount } = req.body;
        const result = await pool.query(
            `UPDATE fee_structures SET fee_type = $1, amount = $2 WHERE id = $3 RETURNING *`,
            [fee_type, amount, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Fee structure not found' });
        }
        res.status(200).json({ success: true, fee: result.rows[0], message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
