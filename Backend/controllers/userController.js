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
            const schoolData = { name: schoolName, code: schoolCode, email: schoolEmail, phone: schoolPhone, address: schoolAddress, city, state, country, pincode, logo: schoolLogo, website: schoolWebsite };
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
            user: { id: userId, name, email, role: roleName, plainPassword },
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
