const prisma = require('../config/prismaClient');

exports.createStudent = async (req, res) => {
    try {
        const { userId, schoolId, classId, admissionNo, rollNumber, dob, gender, bloodGroup, address, photo, qrCode } = req.body;
        
        const student = await prisma.student.create({
            data: {
                userId,
                schoolId,
                classId,
                admissionNo,
                rollNumber,
                dob: new Date(dob),
                gender,
                bloodGroup,
                address,
                photo,
                qrCode
            }
        });
        
        res.status(201).json({ message: 'Student created successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating student' });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                class: true
            }
        });
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching students' });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true,
                class: true,
                school: true,
                attendance: true
            }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student details' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.dob) {
            updates.dob = new Date(updates.dob);
        }

        const student = await prisma.student.update({
            where: { id: parseInt(id) },
            data: updates
        });

        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating student' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.student.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting student' });
    }
};
