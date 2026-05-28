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
        
        const creatorRole = req.user.role;

        // 1. Check Role Hierarchy
        if (!canManageRole(creatorRole, roleName)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ success: false, message: `Unauthorized: ${creatorRole} cannot create a ${roleName} account.` });
        }

        // 2. Validate Role Existence
        let role = await Role.findByName(roleName, client);
        let roleId;
        if (!role) {
            let newRole = await Role.create(roleName, client);
            roleId = newRole.id;
        } else {
            roleId = role.id;
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
        const userData = { name, email, phone, password: hashedPassword, roleId, schoolId: finalSchoolId, image, gender, dob: dob || null, address };
        const newUser = await User.create(userData, client);
        const userId = newUser.id;

        // 6. Handle Specific Profile Creation
        let profileRecord = null;
        try {
            if (roleName === "Student") {
                if (!classId || !admissionNo) throw new Error("Missing student fields");
                const data = { userId, schoolId: finalSchoolId, classId, admissionNo, rollNumber, section, fatherName, motherName, parentPhone, parentEmail, admissionDate: admissionDate || null, transportRequired: transportRequired === true || transportRequired === 'true', photo: image };
                profileRecord = await Student.create(data, client);
            } else if (roleName === "Parent") {
                const data = { userId, occupation, relation: relation || 'Parent', studentId: studentId || null };
                profileRecord = await Parent.create(data, client);
            } else if (roleName === "Teacher") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `TCH-${Date.now()}`, qualification, experience: experience || null, subject, classAssigned, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Teacher.create(data, client);
            } else if (roleName === "Principal") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `PRIN-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null, department };
                profileRecord = await Principal.create(data, client);
            } else if (roleName === "Accountant") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `ACC-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Accountant.create(data, client);
            } else if (roleName === "Librarian") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `LIB-${Date.now()}`, qualification, experience: experience || null, joiningDate: joiningDate || null };
                profileRecord = await Librarian.create(data, client);
            } else if (roleName === "Transport Manager") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `TM-${Date.now()}`, vehicleAssigned, routeAssigned, licenseNumber, joiningDate: joiningDate || null };
                profileRecord = await TransportManager.create(data, client);
            } else if (roleName === "Receptionist") {
                const data = { userId, schoolId: finalSchoolId, employeeId: employeeId || `REC-${Date.now()}`, joiningDate: joiningDate || null, salary: salary || null };
                profileRecord = await Receptionist.create(data, client);
            }
        } catch (err) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: err.message || "Failed to create profile" });
        }

        await client.query('COMMIT');
        
        res.status(201).json({
            success: true,
            message: `${roleName} account created successfully.`,
            user: { id: userId, name, email, role: roleName },
            profile: profileRecord
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create user account" });
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
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN schools s ON u.school_id = s.id
            LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
            WHERE r.name = 'School Admin'
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
                r.name as role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.school_id = $1 AND r.name != 'School Admin'
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
