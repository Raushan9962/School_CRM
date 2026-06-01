const pool = require('../config/db');
const { Role, School, User, Student, Parent, Teacher, Principal, Accountant, Librarian, TransportManager, Receptionist } = require('../models');
const bcrypt = require('bcrypt');
const { canManageRole } = require('../middleware/rbac');

exports.createUser = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const { 
            name, email, phone, password, roleName, 
            gender, dob, address,
            schoolName, schoolCode, schoolEmail, schoolPhone, schoolAddress, city, state, country, pincode, schoolLogo, schoolWebsite,
            planId, billingCycle,
            employeeId, qualification, experience, joiningDate, salary, department,
            classId, admissionNo, rollNumber, section, fatherName, motherName, parentPhone, parentEmail, admissionDate, transportRequired,
            subject, classAssigned,
            occupation, relation, studentId,
            vehicleAssigned, routeAssigned, licenseNumber
        } = req.body;
        
        const creatorRole = req.user.role?.toLowerCase().replace(/\s+/g, '');
        let targetRoleName = roleName;

        // Force School Admin role if Super Admin is creating
        if (creatorRole === "superadmin") {
            targetRoleName = "School Admin";
        } else if (!targetRoleName) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'roleName is required' });
        }

        // 1. Check Role Hierarchy
        if (!canManageRole(req.user.role, targetRoleName)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ success: false, message: `Unauthorized: ${req.user.role} cannot create a ${targetRoleName} account.` });
        }

        // 3. Handle School Creation
        let finalSchoolId = req.user.schoolId;
        
        if (roleName === "School Admin") {
            if (!schoolName || !schoolEmail || !schoolPhone || !schoolAddress) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: "Missing required school details" });
            }
            const schoolData = { name: schoolName, code: schoolCode, email: schoolEmail, phone: schoolPhone, address: schoolAddress, city, state, country, pincode, logo: schoolLogo, website: schoolWebsite, planId, billingCycle };
            const newSchool = await School.create(schoolData, client);
            finalSchoolId = newSchool.id;
        } else {
            if (!finalSchoolId && req.body.schoolId) {
                finalSchoolId = parseInt(req.body.schoolId);
            }
        }

        // 4. Hash Password
        const plainPassword = password || "123456";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // 5. Create Core User
        const image = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;
        const userData = { name, email, phone: phone || null, password: hashedPassword, roleName: targetRoleName, schoolId: finalSchoolId, image, gender, dob: dob || null, address };
        const newUser = await User.create(userData, client);
        const userId = newUser.id;

        // 6. Handle Specific Profile Creation
        let profileRecord = null;
        try {
            if (targetRoleName === "Student") {
                if (!classId || !admissionNo) throw new Error("Missing student fields");
                const data = { userId, schoolId: finalSchoolId, classId, admissionNo, rollNumber, section, fatherName, motherName, parentPhone, parentEmail, admissionDate: admissionDate || null, transportRequired: transportRequired === true || transportRequired === 'true', photo: image };
                profileRecord = await Student.create(data, client);
            } else if (targetRoleName === "Parent") {
                const data = { userId, occupation, relation: relation || 'Parent', studentId: studentId || null };
                profileRecord = await Parent.create(data, client);
            } else if (targetRoleName === "Teacher") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `TCH-${Date.now()}`, qualification, experience: experience || null, subject, classAssigned, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Teacher.create(data, client);
            } else if (targetRoleName === "Principal") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `PRIN-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null, department };
                profileRecord = await Principal.create(data, client);
            } else if (targetRoleName === "Accountant") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `ACC-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Accountant.create(data, client);
            } else if (targetRoleName === "Librarian") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `LIB-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null };
                profileRecord = await Librarian.create(data, client);
            } else if (targetRoleName === "Transport Manager") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `TM-${Date.now()}`, vehicleAssigned, routeAssigned, licenseNumber, joiningDate: joiningDate || null };
                profileRecord = await TransportManager.create(data, client);
            } else if (targetRoleName === "Receptionist") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `REC-${Date.now()}`, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Receptionist.create(data, client);
            }
        } catch (err) {
            await client.query('ROLLBACK');
            
            // Handle foreign key constraint errors gracefully
            if (err.code === '23503') {
                if (err.constraint === 'students_class_id_fkey') {
                    return res.status(400).json({ success: false, message: "Invalid Class ID. Please ensure the class exists before adding students." });
                }
                return res.status(400).json({ success: false, message: "A referenced record (like Class or School) does not exist." });
            }
            if (err.code === '23505') {
                return res.status(400).json({ success: false, message: "Duplicate record found. The employee ID, email, or admission number might already exist." });
            }

            return res.status(400).json({ success: false, message: err.message || "Failed to create profile" });
        }

        await client.query('COMMIT');
        
        res.status(201).json({
            success: true,
            message: `${targetRoleName} account created successfully.`,
            user: { id: userId, name, email, role: targetRoleName },
            profile: profileRecord
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create user account", error: error.message });
    } finally {
        client.release();
    }
};

exports.seedRoles = async (req, res) => {
    try {
        const roles = ["Super Admin", "School Admin", "Principal", "Teacher", "Student", "Parent", "Accountant", "Librarian", "Transport Manager", "Receptionist"];
        const created = [];
        for (const role of roles) {
            let roleRecord = await Role.findByName(role);
            if (!roleRecord) {
                let newRole = await Role.create(role);
                created.push(newRole);
            }
        }
        res.status(200).json({ success: true, message: "Roles seeded", created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to seed roles" });
    }
};

// GET all School Admins with their School details (Super Admin only)
exports.getAllSchoolAdmins = async (req, res) => {
    try {
        const role = req.user?.role?.toLowerCase().replace(/\s+/g, '');
        if (role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super Admin only.' });
        }

        const result = await pool.query(`
            SELECT 
                u.id AS admin_id,
                u.name AS admin_name,
                u.email AS admin_email,
                u.phone AS admin_phone,
                u.gender,
                u.dob,
                u.address AS admin_address,
                u.image,
                u.created_at AS registered_at,
                s.id AS school_id,
                s.name AS school_name,
                s.code AS school_code,
                s.email AS school_email,
                s.phone AS school_phone,
                s.address AS school_address,
                s.city,
                s.state,
                s.country,
                s.pincode,
                s.website AS school_website,
                s.billing_cycle,
                sp.name AS plan_name,
                sp.max_students
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            WHERE u.role_name = 'School Admin'
            ORDER BY u.created_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch school admins' });
    }
};

// GET users for a specific school (School Admin only)
exports.getSchoolUsers = async (req, res) => {
    try {
        if (req.user.role !== 'School Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. School Admin only.' });
        }

        const schoolId = req.user.schoolId;

        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.is_active, u.created_at,
                u.role_name as role
            FROM users u
            WHERE u.school_id = $1 AND u.role_name != 'School Admin'
            ORDER BY u.created_at DESC
        `, [schoolId]);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch school users' });
    }
};

// GET detailed students for a school
exports.getSchoolStudents = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                s.admission_no, s.roll_number, s.section, s.admission_date, s.transport_required,
                s.father_name, s.mother_name, s.parent_phone,
                c.name as class_name, c.section as class_section,
                COALESCE(SUM(f.amount), 0) as total_fees_due
            FROM users u
            JOIN students s ON u.id = s.user_id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN fees f ON s.id = f.student_id AND f.status != 'Paid'
            WHERE u.school_id = $1 AND u.role_name = 'Student'
            GROUP BY u.id, s.id, c.id
            ORDER BY u.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch detailed students' });
    }
};

// GET detailed teachers for a school
exports.getSchoolTeachers = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                t.employee_id, t.qualification, t.experience, t.subject, t.class_assigned, t.joining_date, t.salary
            FROM users u
            JOIN teachers t ON u.id = t.user_id
            WHERE u.school_id = $1 AND u.role_name = 'Teacher'
            ORDER BY u.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch detailed teachers' });
    }
};

// GET detailed parents for a school
exports.getSchoolParents = async (req, res) => {
    try {
        // Parents might not directly have a school_id if they are linked via students, 
        // but users table has school_id. Let's rely on users.school_id
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                p.occupation, p.relation,
                su.name as student_name, c.name as student_class
            FROM users u
            JOIN parents p ON u.id = p.user_id
            LEFT JOIN students s ON p.student_id = s.id
            LEFT JOIN users su ON s.user_id = su.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE u.school_id = $1 AND u.role_name = 'Parent'
            ORDER BY u.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch detailed parents' });
    }
};

// GET detailed accountants for a school
exports.getSchoolAccountants = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                a.employee_id, a.qualification, a.experience, a.joining_date, a.salary
            FROM users u
            JOIN accountants a ON u.id = a.user_id
            WHERE u.school_id = $1 AND u.role_name = 'Accountant'
            ORDER BY u.created_at DESC
        `, [schoolId]);
        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch accountants' });
    }
};

// GET detailed librarians for a school
exports.getSchoolLibrarians = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                l.employee_id, l.qualification, l.experience, l.joining_date
            FROM users u
            JOIN librarians l ON u.id = l.user_id
            WHERE u.school_id = $1 AND u.role_name = 'Librarian'
            ORDER BY u.created_at DESC
        `, [schoolId]);
        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch librarians' });
    }
};

// GET detailed transport managers for a school
exports.getSchoolTransportManagers = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.gender, u.dob, u.image, u.address, u.is_active, u.created_at,
                tm.employee_id, tm.vehicle_assigned, tm.route_assigned, tm.license_number, tm.joining_date
            FROM users u
            JOIN transport_managers tm ON u.id = tm.user_id
            WHERE u.school_id = $1 AND u.role_name = 'Transport Manager'
            ORDER BY u.created_at DESC
        `, [schoolId]);
        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch transport managers' });
    }
};

// GET attendance records for all students in a school
exports.getSchoolAttendance = async (req, res) => {
    try {
        if (req.user.role !== 'School Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. School Admin only.' });
        }
        const schoolId = req.user.schoolId;

        const result = await pool.query(`
            SELECT 
                a.id, a.date, a.status, a.remarks, a.created_at,
                s.id as student_id, s.admission_no, s.roll_number,
                u.name as student_name, u.image as student_image,
                c.name as class_name, c.section as class_section
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.school_id = $1
            ORDER BY a.date DESC, u.name ASC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
    }
};

// POST mark attendance for a student
exports.markSchoolAttendance = async (req, res) => {
    try {
        if (req.user.role !== 'School Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. School Admin only.' });
        }
        const schoolId = req.user.schoolId;
        const { studentId, classId, date, status, remarks } = req.body;

        if (!studentId || !date || !status) {
            return res.status(400).json({ success: false, message: 'studentId, date, and status are required' });
        }

        // Verify student belongs to this school
        const studentCheck = await pool.query('SELECT id FROM students WHERE id = $1 AND school_id = $2', [studentId, schoolId]);
        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found in your school' });
        }

        // Check if attendance already exists for this student on this date
        const existing = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND date = $2', [studentId, date]);
        if (existing.rows.length > 0) {
            // Update existing
            const updated = await pool.query(
                'UPDATE attendance SET status = $1, remarks = $2 WHERE student_id = $3 AND date = $4 RETURNING *',
                [status, remarks || null, studentId, date]
            );
            return res.status(200).json({ success: true, message: 'Attendance updated', data: updated.rows[0] });
        }

        const result = await pool.query(
            'INSERT INTO attendance (student_id, class_id, date, status, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [studentId, classId || null, date, status, remarks || null]
        );

        return res.status(201).json({ success: true, message: 'Attendance marked successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to mark attendance' });
    }
};

// GET fees history for all students in a school
exports.getSchoolFeesHistory = async (req, res) => {
    try {
        if (req.user.role !== 'School Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. School Admin only.' });
        }
        const schoolId = req.user.schoolId;

        const result = await pool.query(`
            SELECT 
                f.id, f.amount, f.due_date, f.status, f.paid_date, f.created_at,
                s.id as student_id, s.admission_no, s.roll_number,
                u.name as student_name, u.image as student_image,
                c.name as class_name, c.section as class_section
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.school_id = $1
            ORDER BY f.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch fees history' });
    }
};

// POST add a fee record for a student
exports.addSchoolFee = async (req, res) => {
    try {
        if (req.user.role !== 'School Admin') {
            return res.status(403).json({ success: false, message: 'Access denied. School Admin only.' });
        }
        const schoolId = req.user.schoolId;
        const { studentId, amount, dueDate, status, paidDate } = req.body;

        if (!studentId || !amount) {
            return res.status(400).json({ success: false, message: 'studentId and amount are required' });
        }

        // Verify student belongs to this school
        const studentCheck = await pool.query('SELECT id FROM students WHERE id = $1 AND school_id = $2', [studentId, schoolId]);
        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found in your school' });
        }

        const result = await pool.query(
            'INSERT INTO fees (student_id, amount, due_date, status, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [studentId, amount, dueDate || null, status || 'Pending', paidDate || null]
        );

        return res.status(201).json({ success: true, message: 'Fee record added successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to add fee record' });
    }
};
