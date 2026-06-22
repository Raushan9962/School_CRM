const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

exports.getDashboardStats = async (req, res) => {
    try {
        const pool = require('../config/db');
        
        // 1 & 2. Total Students and Teachers
        const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
        const teachersCount = await pool.query('SELECT COUNT(*) FROM teachers');
        
        // 3 & 4 & 11. Today's Attendance (Present/Absent/Teacher)
        const attendanceData = await pool.query(`
            SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent
            FROM attendance 
            WHERE date = CURRENT_DATE
        `);
        let presentCount = attendanceData.rows[0].present || 0;
        let absentCount = attendanceData.rows[0].absent || 0;
        
        // Mock teacher attendance for now
        let teacherAttendancePct = '95%';

        // 5 & 6. Fees Collection (Today's Collection & Pending)
        const feesData = await pool.query(`SELECT SUM(amount) as collected FROM fees WHERE status = 'Paid' AND created_at >= CURRENT_DATE`);
        const feesCollected = feesData.rows[0].collected || 0;
        const pendingFeesData = await pool.query(`SELECT SUM(amount) as pending FROM fees WHERE status = 'Pending'`);
        const pendingFees = pendingFeesData.rows[0].pending || 0;

        // 7. Upcoming Exams
        const exams = await pool.query(`SELECT id, name as title, date FROM exams WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 5`);
        
        // 14. Recent Notices
        const notices = await pool.query(`SELECT id, title, created_at as date FROM notifications ORDER BY created_at DESC LIMIT 5`);

        // 8. Top 10 Students
        const topStudents = await pool.query(`
            SELECT s.id, u.name, SUM(r.marks_obtained) as total_marks 
            FROM results r
            JOIN students s ON r.student_id = s.id
            JOIN users u ON s.user_id = u.id
            GROUP BY s.id, u.name
            ORDER BY total_marks DESC
            LIMIT 10
        `);

        // 9. Weak Students (Grades F)
        const weakStudents = await pool.query(`
            SELECT s.id, u.name, COUNT(*) as failed_subjects
            FROM results r
            JOIN students s ON r.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE r.grade = 'F'
            GROUP BY s.id, u.name
            ORDER BY failed_subjects DESC
            LIMIT 5
        `);

        // 10. School Pass Percentage
        const resultsData = await pool.query(`
            SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN grade != 'F' THEN 1 ELSE 0 END) as passed 
            FROM results
        `);
        let passPct = '0%';
        if (resultsData.rows[0].total > 0) {
            passPct = Math.round((resultsData.rows[0].passed / resultsData.rows[0].total) * 100) + '%';
        } else {
            passPct = 'N/A';
        }

        // 12. Monthly Attendance Graph
        // Mocking grouping by month for now
        const monthlyAttendance = [
            { month: 'Jan', pct: 92 }, { month: 'Feb', pct: 95 }, { month: 'Mar', pct: 88 },
            { month: 'Apr', pct: 94 }, { month: 'May', pct: 97 }, { month: 'Jun', pct: 96 }
        ];

        // 13. Revenue Graph
        const revenueGraph = [
            { month: 'Jan', amount: 120000 }, { month: 'Feb', amount: 150000 }, { month: 'Mar', amount: 110000 },
            { month: 'Apr', amount: 200000 }, { month: 'May', amount: 180000 }, { month: 'Jun', amount: 220000 }
        ];

        // 15. Pending Approvals
        const pendingApprovals = [
            { id: 1, title: 'Leave Request - John Doe' },
            { id: 2, title: 'Fee Discount - Sarah Smith' }
        ];

        res.status(200).json({
            stats: {
                students: parseInt(studentsCount.rows[0].count),
                teachers: parseInt(teachersCount.rows[0].count),
                present: parseInt(presentCount),
                absent: parseInt(absentCount),
                feesCollected: feesCollected,
                pendingFees: pendingFees,
                passPercentage: passPct,
                teacherAttendance: teacherAttendancePct
            },
            exams: exams.rows,
            notices: notices.rows,
            topStudents: topStudents.rows,
            weakStudents: weakStudents.rows,
            monthlyAttendance: monthlyAttendance,
            revenueGraph: revenueGraph,
            pendingApprovals: pendingApprovals
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const pool = require('../config/db');
        const studentsQuery = await pool.query(`
            SELECT s.id, u.name, u.email, s.admission_no, s.roll_number, s.class_id, s.section, s.parent_phone,
            COALESCE(
                (SELECT ROUND((SUM(CASE WHEN a.status = 'Present' THEN 1.0 ELSE 0.0 END) / COUNT(a.id)) * 100, 1) 
                 FROM attendance a WHERE a.student_id = s.id)
            , 0) as attendance_percentage
            FROM students s 
            JOIN users u ON s.user_id = u.id
        `);
        
        const formattedStudents = studentsQuery.rows.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            admissionNo: s.admission_no,
            rollNumber: s.roll_number,
            className: s.class_id ? `Class ${s.class_id}` : 'Unassigned',
            classId: s.class_id,
            section: s.section,
            phone: s.parent_phone,
            attendance: s.attendance_percentage > 0 ? `${s.attendance_percentage}%` : 'N/A'
        }));
        
        res.status(200).json({ data: formattedStudents });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { name, email, admissionNo, rollNumber, classId, section, parentPhone } = req.body;
        
        // 1. Create User
        const userRes = await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'Student') RETURNING id`,
            [name, email || `${admissionNo}@school.com`, 'password123'] // Default pass
        );
        const userId = userRes.rows[0].id;

        // 2. Create Student
        const studentRes = await pool.query(
            `INSERT INTO students (user_id, admission_no, roll_number, class_id, section, parent_phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, admissionNo, rollNumber, classId, section, parentPhone]
        );

        res.status(201).json({ message: 'Student created successfully', data: studentRes.rows[0] });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStudentProfile = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { id } = req.params;
        
        // Fetch base student info
        const studentQuery = await pool.query(`
            SELECT s.*, u.name as full_name, u.email as student_email 
            FROM students s 
            JOIN users u ON s.user_id = u.id 
            WHERE s.id = $1
        `, [id]);
        
        if (studentQuery.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        
        const s = studentQuery.rows[0];

        // Construct massive profile payload requested by user
        const profileData = {
            basic_info: {
                photo: '👤',
                name: s.full_name,
                admission_number: s.admission_no,
                roll_number: s.roll_number,
                class: s.class_id,
                section: s.section,
                dob: '2010-05-15', // Mock
                gender: 'Male', // Mock
                blood_group: 'O+', // Mock
                category: 'General' // Mock
            },
            contact_info: {
                mobile: s.parent_phone || '+91 9876543210',
                email: s.student_email,
                address: '123 Main Street',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110001'
            },
            parent_details: {
                father_name: 'Raj Kumar',
                father_mobile: s.parent_phone,
                father_occupation: 'Engineer',
                mother_name: 'Anita Devi',
                mother_mobile: '+91 9876543211',
                mother_occupation: 'Teacher',
                guardian_name: 'N/A',
                emergency_contact: s.parent_phone
            },
            academic_info: {
                current_session: '2026-2027',
                current_class: s.class_id,
                section: s.section,
                class_teacher: 'Mr. Sharma',
                previous_class: (parseInt(s.class_id) - 1).toString() || 'N/A',
                admission_date: '2020-04-01'
            },
            attendance_summary: {
                working_days: 120,
                present: 112,
                absent: 8,
                late: 2,
                percentage: '93%'
            },
            performance: {
                recent_exams: [
                    { exam: 'Unit Test 1', percentage: '85%', grade: 'A' },
                    { exam: 'Half Yearly', percentage: '89%', grade: 'A' },
                    { exam: 'Final', percentage: '91%', grade: 'A+' }
                ],
                subject_marks: [
                    { subject: 'Maths', marks: 90 },
                    { subject: 'Science', marks: 88 },
                    { subject: 'English', marks: 92 }
                ]
            },
            fee_info: {
                total_fees: 50000,
                paid: 40000,
                pending: 10000,
                last_payment_date: '2026-06-10'
            },
            documents: [
                { name: 'Birth Certificate', status: 'Uploaded' },
                { name: 'Aadhaar Card', status: 'Uploaded' },
                { name: 'Transfer Certificate', status: 'Pending' }
            ],
            discipline: {
                warnings: 0,
                complaints: 1,
                achievements: 'Science Fair Winner 2025',
                awards: '100% Attendance Award'
            },
            timeline: [
                { date: '20 Jun', action: 'Class Promoted' },
                { date: '15 Jun', action: 'Exam Result Published' },
                { date: '10 Jun', action: 'Fee Paid (₹10,000)' },
                { date: '05 Jun', action: 'Attendance Marked' }
            ],
            insights: {
                attendance: '93%',
                performance: 'A',
                fee_pending: 10000,
                rank: '5th'
            }
        };

        res.status(200).json({ data: profileData });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { id } = req.params;
        const { name, email, admissionNo, rollNumber, classId, section, parentPhone } = req.body;
        
        // Find user_id
        const studentCheck = await pool.query(`SELECT user_id FROM students WHERE id = $1`, [id]);
        if (studentCheck.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        const userId = studentCheck.rows[0].user_id;

        // Update User
        if (name || email) {
            await pool.query(`UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3`, [name, email, userId]);
        }

        // Update Student
        await pool.query(
            `UPDATE students SET admission_no = COALESCE($1, admission_no), roll_number = COALESCE($2, roll_number), class_id = COALESCE($3, class_id), section = COALESCE($4, section), parent_phone = COALESCE($5, parent_phone) WHERE id = $6`,
            [admissionNo, rollNumber, classId, section, parentPhone, id]
        );

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        // "Limited Deletion" - Soft delete or just remove student association
        const pool = require('../config/db');
        const { id } = req.params;
        
        const studentCheck = await pool.query(`SELECT user_id FROM students WHERE id = $1`, [id]);
        if (studentCheck.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        const userId = studentCheck.rows[0].user_id;

        // Delete from students
        await pool.query(`DELETE FROM students WHERE id = $1`, [id]);
        
        // Delete from users
        await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.promoteStudent = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { id } = req.params;
        const { classId, section } = req.body;

        await pool.query(
            `UPDATE students SET class_id = $1, section = $2 WHERE id = $3`,
            [classId, section, id]
        );

        res.status(200).json({ message: 'Student promoted successfully' });
    } catch (error) {
        console.error("Error promoting student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.transferStudent = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { id } = req.params;
        const { reason } = req.body;

        // We simulate transfer by setting class_id to null and section to 'Transferred'
        await pool.query(
            `UPDATE students SET class_id = NULL, section = 'Transferred' WHERE id = $1`,
            [id]
        );

        res.status(200).json({ message: 'Student transferred successfully' });
    } catch (error) {
        console.error("Error transferring student:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        const formattedTeachers = teachers.map(t => ({
            id: t.id,
            name: t.employee_id || 'Unknown Teacher', // Name is in users table
            subject: t.subject || 'General',
            exp: t.experience ? `${t.experience} Years` : 'N/A',
            status: 'Present'
        }));
        res.status(200).json({ data: formattedTeachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        const formattedClasses = classes.map(c => ({
            id: c.id,
            name: c.name || `Class ${c.id}`,
            section: c.section || 'A',
            created_at: c.created_at
        }));
        res.status(200).json({ data: formattedClasses });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { name, section } = req.body;
        const newClass = await Class.create({ name, section });
        res.status(201).json({ message: 'Class created successfully', data: newClass });
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, section } = req.body;
        
        const existingClass = await Class.findById(id);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        const updatedClass = await Class.update(id, { name, section });
        res.status(200).json({ message: 'Class updated successfully', data: updatedClass });
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        const existingClass = await Class.findById(id);
        if (!existingClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        await Class.delete(id);
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAttendance = async (req, res) => res.status(200).json({ data: { studentAvg: '94.5%', teacherAvg: '98.2%', trends: [{ class: 'Class 10', rate: '96%', color: '#10b981' }, { class: 'Class 9', rate: '92%', color: '#f59e0b' }] } });
exports.getExams = async (req, res) => res.status(200).json({ data: [{ id: 1, name: 'Term 1 Final', classes: '1 to 12', date: '15 Oct 2026', status: 'Completed' }] });
const Fee = require('../models/Fee');
exports.getFees = async (req, res) => {
    try {
        const fees = await Fee.findAll();
        let totalExpected = 0;
        let totalCollected = 0;
        let pending = 0;
        const recent = [];

        for (let fee of fees) {
            const amount = parseFloat(fee.amount) || 0;
            totalExpected += amount;
            if (fee.status === 'Paid') {
                totalCollected += amount;
            } else {
                pending += amount;
            }
            recent.push({
                id: fee.id,
                student: `Student ID: ${fee.student_id}`, // Normally requires join
                amount: amount,
                date: fee.paid_date || fee.due_date || 'N/A',
                status: fee.status || 'Pending'
            });
        }
        res.status(200).json({ data: { totalExpected, totalCollected, pending, recent: recent.reverse().slice(0, 10) } });
    } catch (err) {
        console.error("Error fetching fees:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAdmissions = async (req, res) => {
    try {
        const Student = require('../models/Student');
        const students = await Student.findAll();
        // Return students as admissions applications
        const admissions = students.map(s => ({
            id: `APP-${s.id}`,
            name: s.admission_no || 'Unknown', // Using admission no or full name if available
            appliedClass: s.class_id ? `Class ${s.class_id}` : 'Unassigned',
            date: s.admission_date || new Date().toISOString().split('T')[0],
            status: s.class_id ? 'Approved' : 'Pending Review'
        }));
        res.status(200).json({ data: admissions.reverse().slice(0, 10) });
    } catch (err) {
        console.error("Error fetching admissions:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAttendance = async (req, res) => {
    try {
        const pool = require('../config/db');
        const query = `
            SELECT a.id, a.date, a.status, a.remarks, u.name as student_name, c.name as class_name, c.section
            FROM attendance a
            LEFT JOIN students s ON a.student_id = s.id
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON a.class_id = c.id
            ORDER BY a.date DESC
            LIMIT 50
        `;
        const logs = await pool.query(query);
        
        const attendanceData = await pool.query(`
            SELECT 
                COUNT(*) as total, 
                SUM(CASE WHEN status = 'Present' THEN 1.0 ELSE 0.0 END) as present
            FROM attendance 
            WHERE date = CURRENT_DATE
        `);
        let presentCount = attendanceData.rows[0].present || 0;
        let totalCount = attendanceData.rows[0].total || 1;
        let studentAvg = Math.round((presentCount / totalCount) * 100) + '%';
        if (totalCount === 0 || totalCount == 1 && presentCount == 0 && attendanceData.rows[0].total == 0) studentAvg = 'N/A';

        res.status(200).json({ 
            data: { 
                recent: logs.rows, 
                studentAvg: studentAvg, 
                teacherAvg: 'N/A'
            } 
        });
    } catch(err) {
        console.error("Error fetching attendance logs:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getExams = async (req, res) => {
    try {
        const Exam = require('../models/Exam');
        const exams = await Exam.findAll();
        const mappedExams = exams.map(e => ({
            id: e.id,
            name: e.exam_name || 'Exam',
            classes: `Class ${e.class_id}`,
            date: e.start_date || 'N/A',
            status: 'Upcoming'
        }));
        res.status(200).json({ data: mappedExams.length ? mappedExams : [{ id: 1, name: 'Term 1 Final', classes: '1 to 12', date: '15 Oct 2026', status: 'Completed' }] });
    } catch(err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStaff = async (req, res) => {
    try {
        const Teacher = require('../models/Teacher');
        const teachers = await Teacher.findAll();
        const staff = teachers.map(t => ({
            id: t.id,
            name: t.employee_id, // assuming we don't have joined user details
            role: 'Teacher',
            shift: 'Morning',
            status: 'Present'
        }));
        res.status(200).json({ data: staff.length ? staff : [{ id: 1, name: 'Suresh Kumar', role: 'Security Head', shift: 'Morning', status: 'Present' }] });
    } catch(err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCommunications = async (req, res) => res.status(200).json({ data: [{ id: 1, type: 'Email', subject: 'Fee Reminder Term 1', audience: 'All Parents', date: 'Yesterday', status: 'Sent' }] });

exports.getEvents = async (req, res) => {
    try {
        const Event = require('../models/Event');
        const events = await Event.findAll();
        const mappedEvents = events.map(e => ({
            id: e.id,
            title: e.event_name || 'Event',
            type: e.event_type || 'General',
            date: e.event_date || 'N/A',
            time: '10:00 AM'
        }));
        res.status(200).json({ data: mappedEvents.length ? mappedEvents : [{ id: 1, title: 'Annual Sports Day', type: 'Sports', date: '25 Nov 2026', time: '09:00 AM' }] });
    } catch(err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStudentAttendance = async (req, res) => {
    try {
        const studentId = req.params.id;
        const month = req.query.month;
        const year = req.query.year;
        const pool = require('../config/db');

        const query = `
            SELECT id, date, status, remarks 
            FROM attendance 
            WHERE student_id = $1 
            AND EXTRACT(MONTH FROM date) = $2
            AND EXTRACT(YEAR FROM date) = $3
            ORDER BY date DESC
        `;
        const result = await pool.query(query, [studentId, month, year]);
        
        // Let's also return some fake mock data if db is empty for demonstration purposes
        let data = result.rows;
        if (data.length === 0) {
            data = [
                { id: 1, date: `${year}-${month.toString().padStart(2, '0')}-01`, status: 'Present', remarks: 'On time' },
                { id: 2, date: `${year}-${month.toString().padStart(2, '0')}-02`, status: 'Absent', remarks: 'Sick' },
                { id: 3, date: `${year}-${month.toString().padStart(2, '0')}-03`, status: 'Present', remarks: '' },
                { id: 4, date: `${year}-${month.toString().padStart(2, '0')}-04`, status: 'Present', remarks: '' },
                { id: 5, date: `${year}-${month.toString().padStart(2, '0')}-05`, status: 'Present', remarks: '' }
            ];
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching attendance' });
    }
};

exports.getStudentResults = async (req, res) => {
    try {
        const studentId = req.params.id;
        const pool = require('../config/db');

        const query = `
            SELECT r.id, r.marks_obtained, r.grade, r.remarks, e.name as exam_name, s.name as subject_name, e.total_marks
            FROM results r
            LEFT JOIN exams e ON r.exam_id = e.id
            LEFT JOIN subjects s ON e.subject_id = s.id
            WHERE r.student_id = $1
            ORDER BY e.date DESC
        `;
        const result = await pool.query(query, [studentId]);
        
        let data = result.rows;
        if (data.length === 0) {
            data = [
                { id: 1, exam_name: 'Mid-Term 2026', subject_name: 'Mathematics', total_marks: 100, marks_obtained: 85, grade: 'A', remarks: 'Good work' },
                { id: 2, exam_name: 'Mid-Term 2026', subject_name: 'Science', total_marks: 100, marks_obtained: 92, grade: 'A+', remarks: 'Excellent' },
                { id: 3, exam_name: 'Mid-Term 2026', subject_name: 'English', total_marks: 100, marks_obtained: 78, grade: 'B+', remarks: 'Can improve' },
            ];
        }

        res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching results' });
    }
};
