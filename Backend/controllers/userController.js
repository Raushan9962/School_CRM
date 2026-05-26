const prisma = require('../config/prismaClient');
const bcrypt = require('bcrypt');
const { canManageRole } = require('../middleware/rbac');

exports.createUser = async (req, res) => {
    try {
        const { 
            name, email, phone, password, roleName, 
            gender, dob, address, // Generic fields
            // School Admin / Super Admin
            schoolName, schoolCode, schoolEmail, schoolPhone, schoolAddress, city, state, country, pincode, schoolLogo, schoolWebsite,
            // Generic profile fields
            employeeId, qualification, experience, joiningDate, salary, department,
            // Student specific fields
            classId, admissionNo, rollNumber, section, fatherName, motherName, parentPhone, parentEmail, admissionDate, transportRequired,
            // Teacher specific fields
            subject, classAssigned,
            // Parent specific fields
            occupation, relation, studentId,
            // Transport specific fields
            vehicleAssigned, routeAssigned, licenseNumber
        } = req.body;
        
        const creatorRole = req.user.role; // Injected by auth middleware

        // 1. Check Role Hierarchy using our helper
        if (!canManageRole(creatorRole, roleName)) {
            return res.status(403).json({
                success: false,
                message: `Unauthorized: ${creatorRole} cannot create a ${roleName} account.`
            });
        }

        // 2. Validate Role Existence
        let role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            // Auto-seed the role if it doesn't exist for convenience
            role = await prisma.role.create({ data: { name: roleName } });
        }

        // 3. Handle School Creation for School Admin
        let finalSchoolId = req.user.schoolId; // Inherit by default
        
        if (roleName === "School Admin") {
            if (!schoolName || !schoolEmail || !schoolPhone || !schoolAddress) {
                return res.status(400).json({ success: false, message: "Missing required school details for creating School Admin" });
            }
            const newSchool = await prisma.school.create({
                data: {
                    name: schoolName,
                    code: schoolCode,
                    email: schoolEmail,
                    phone: schoolPhone,
                    address: schoolAddress,
                    city,
                    state,
                    country,
                    pincode,
                    logo: schoolLogo,
                    website: schoolWebsite
                }
            });
            finalSchoolId = newSchool.id;
        } else {
            // For other roles, they must belong to a school (except maybe Super Admin, but they aren't created here)
            if (!finalSchoolId && req.body.schoolId) {
                finalSchoolId = parseInt(req.body.schoolId);
            }
        }

        // 4. Hash Password (use default if not provided)
        const plainPassword = password || "123456"; // Default fallback
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // 5. Create the core User record
        const image = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;
        
        const userData = {
            name,
            email,
            phone,
            password: hashedPassword,
            roleId: role.id,
            schoolId: finalSchoolId,
            image,
            gender,
            dob: dob ? new Date(dob) : null,
            address
        };

        const newUser = await prisma.user.create({ data: userData });

        // 6. Handle Specific Profile Creation based on Role
        let profileRecord = null;
        
        try {
            if (roleName === "Student") {
                if (!classId || !admissionNo) {
                    throw new Error("Missing required student profile fields");
                }
                profileRecord = await prisma.student.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        classId: parseInt(classId),
                        admissionNo,
                        rollNumber,
                        section,
                        fatherName,
                        motherName,
                        parentPhone,
                        parentEmail,
                        admissionDate: admissionDate ? new Date(admissionDate) : undefined,
                        transportRequired: transportRequired === true || transportRequired === 'true',
                        photo: image
                    }
                });
            } else if (roleName === "Parent") {
                profileRecord = await prisma.parent.create({
                    data: {
                        userId: newUser.id,
                        occupation,
                        relation: relation || 'Parent',
                        studentId: studentId ? parseInt(studentId) : null
                    }
                });
            } else if (roleName === "Teacher") {
                profileRecord = await prisma.teacher.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `TCH-${Date.now()}`,
                        qualification,
                        experience: experience ? parseInt(experience) : null,
                        subject,
                        classAssigned,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
                        salary: salary ? parseFloat(salary) : null
                    }
                });
            } else if (roleName === "Principal") {
                profileRecord = await prisma.principal.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `PRIN-${Date.now()}`,
                        qualification,
                        experience: experience ? parseInt(experience) : null,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
                        department
                    }
                });
            } else if (roleName === "Accountant") {
                profileRecord = await prisma.accountant.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `ACC-${Date.now()}`,
                        qualification,
                        experience: experience ? parseInt(experience) : null,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
                        salary: salary ? parseFloat(salary) : null
                    }
                });
            } else if (roleName === "Librarian") {
                profileRecord = await prisma.librarian.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `LIB-${Date.now()}`,
                        qualification,
                        experience: experience ? parseInt(experience) : null,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined
                    }
                });
            } else if (roleName === "Transport Manager") {
                profileRecord = await prisma.transportManager.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `TM-${Date.now()}`,
                        vehicleAssigned,
                        routeAssigned,
                        licenseNumber,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined
                    }
                });
            } else if (roleName === "Receptionist") {
                profileRecord = await prisma.receptionist.create({
                    data: {
                        userId: newUser.id,
                        schoolId: newUser.schoolId,
                        employeeId: employeeId || `REC-${Date.now()}`,
                        joiningDate: joiningDate ? new Date(joiningDate) : undefined,
                        salary: salary ? parseFloat(salary) : null
                    }
                });
            }
        } catch (profileError) {
            // Rollback user creation if profile fails
            await prisma.user.delete({ where: { id: newUser.id } });
            console.error(profileError);
            return res.status(400).json({ success: false, message: profileError.message || "Failed to create specific profile details" });
        }

        res.status(201).json({
            success: true,
            message: `${roleName} account created successfully.`,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: roleName,
                plainPassword // Return password so Admin can give it to the user
            },
            profile: profileRecord
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create user account" });
    }
};

// Seed Roles utility endpoint
exports.seedRoles = async (req, res) => {
    try {
        const roles = [
            "Super Admin", "School Admin", "Principal", "Teacher", 
            "Student", "Parent", "Accountant", "Librarian", 
            "Transport Manager", "Receptionist"
        ];

        const created = [];
        for (const role of roles) {
            const exists = await prisma.role.findUnique({ where: { name: role } });
            if (!exists) {
                created.push(await prisma.role.create({ data: { name: role } }));
            }
        }
        res.status(200).json({ success: true, message: "Roles seeded", created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to seed roles" });
    }
};
