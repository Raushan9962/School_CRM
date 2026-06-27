const pool = require('../config/db');

// GET /api/teacher-portal/dashboard-stats
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        // Find teacher record
        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t 
             JOIN users u ON t.user_id = u.id 
             WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );

        if (!teacherRes.rows.length) {
            return res.status(404).json({ success: false, message: 'Teacher record not found for this user.' });
        }
        const teacherId = teacherRes.rows[0].id;

        // Total students in teacher's classes
        let totalStudents = 0;
        try {
            const studentsRes = await pool.query(
                `SELECT COUNT(DISTINCT sc.student_id) 
                 FROM student_classes sc
                 JOIN timetable t ON t.class_id = sc.class_id
                 WHERE t.teacher_id = $1`,
                [teacherId]
            );
            totalStudents = parseInt(studentsRes.rows[0].count) || 0;
        } catch(e) { totalStudents = 0; }

        // Total my classes
        let totalClasses = 0;
        try {
            const classesRes = await pool.query(
                `SELECT COUNT(DISTINCT class_id) FROM timetable WHERE teacher_id = $1`,
                [teacherId]
            );
            totalClasses = parseInt(classesRes.rows[0].count) || 0;
        } catch(e) { totalClasses = 0; }

        // Leave balance - count approved leaves this year
        let leaveBalance = { casual: 8, medical: 5, earned: 12 };
        try {
            const leavesUsedRes = await pool.query(
                `SELECT leave_type, SUM(EXTRACT(DAY FROM (end_date - start_date)) + 1) as days_used
                 FROM leaves
                 WHERE user_id = $1 AND status = 'Approved'
                 AND EXTRACT(YEAR FROM start_date) = EXTRACT(YEAR FROM CURRENT_DATE)
                 GROUP BY leave_type`,
                [userId]
            );
            leavesUsedRes.rows.forEach(row => {
                const type = (row.leave_type || '').toLowerCase();
                const used = parseInt(row.days_used) || 0;
                if (type.includes('casual')) leaveBalance.casual = Math.max(0, 8 - used);
                if (type.includes('medical') || type.includes('sick')) leaveBalance.medical = Math.max(0, 5 - used);
                if (type.includes('earned')) leaveBalance.earned = Math.max(0, 12 - used);
            });
        } catch(e) {}

        // Today's pending assignments to grade
        let pendingWork = 0;
        try {
            const pendingRes = await pool.query(
                `SELECT COUNT(*) FROM homeworks WHERE teacher_id = $1 AND due_date < CURRENT_DATE`,
                [teacherId]
            );
            pendingWork = parseInt(pendingRes.rows[0].count) || 0;
        } catch(e) { pendingWork = 0; }

        // Today's timetable
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDay = dayNames[new Date().getDay()];
        let todaySchedule = [];
        try {
            const scheduleRes = await pool.query(
                `SELECT t.period_number, t.start_time, t.end_time, 
                        c.name as class_name, c.section,
                        s.name as subject_name
                 FROM timetable t
                 JOIN classes c ON t.class_id = c.id
                 JOIN subjects s ON t.subject_id = s.id
                 WHERE t.teacher_id = $1 AND LOWER(t.day_of_week) = LOWER($2)
                 ORDER BY t.period_number`,
                [teacherId, todayDay]
            );
            todaySchedule = scheduleRes.rows;
        } catch(e) { todaySchedule = []; }

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalClasses,
                leaveBalance,
                pendingWork,
                todaySchedule,
                teacherId
            }
        });
    } catch (error) {
        console.error('Teacher Dashboard Stats Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
    }
};

// GET /api/teacher-portal/my-classes
exports.getMyClasses = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t 
             JOIN users u ON t.user_id = u.id 
             WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        if (!teacherRes.rows.length) {
            return res.status(404).json({ success: false, message: 'Teacher not found.' });
        }
        const teacherId = teacherRes.rows[0].id;

        let classes = [];
        try {
            const classesRes = await pool.query(
                `SELECT DISTINCT c.id, c.name, c.section, c.school_id,
                        COUNT(DISTINCT sc.student_id) as student_count,
                        STRING_AGG(DISTINCT s.name, ', ') as subjects_taught
                 FROM timetable tt
                 JOIN classes c ON tt.class_id = c.id
                 JOIN subjects s ON tt.subject_id = s.id
                 LEFT JOIN student_classes sc ON sc.class_id = c.id
                 WHERE tt.teacher_id = $1
                 GROUP BY c.id, c.name, c.section, c.school_id
                 ORDER BY c.name`,
                [teacherId]
            );
            classes = classesRes.rows;
        } catch(e) { classes = []; }

        return res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error('Get My Classes Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch classes.' });
    }
};

// GET /api/teacher-portal/class-students/:classId
exports.getClassStudents = async (req, res) => {
    try {
        const { classId } = req.params;

        let students = [];
        try {
            const studentsRes = await pool.query(
                `SELECT s.id, s.name, s.roll_number, s.photo,
                        u.email,
                        COALESCE(att.status, 'Not Marked') as today_attendance
                 FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id
                 LEFT JOIN users u ON u.id = s.user_id
                 LEFT JOIN attendance att ON att.student_id = s.id AND att.date = CURRENT_DATE AND att.class_id = $1::int
                 WHERE sc.class_id = $1::int
                 ORDER BY s.roll_number`,
                [classId]
            );
            students = studentsRes.rows;
        } catch(e) {
            // Fallback: try without class_id in attendance
            const studentsRes = await pool.query(
                `SELECT s.id, s.name, s.roll_number, s.photo, u.email
                 FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id
                 LEFT JOIN users u ON u.id = s.user_id
                 WHERE sc.class_id = $1
                 ORDER BY s.roll_number`,
                [classId]
            );
            students = studentsRes.rows;
        }

        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error('Get Class Students Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch students.' });
    }
};

// POST /api/teacher-portal/submit-attendance
exports.submitAttendance = async (req, res) => {
    const client = await pool.connect();
    try {
        const { classId, date, attendanceData } = req.body;
        // attendanceData: [{ studentId, status }] where status = 'Present'|'Absent'|'Late'|'Excused'

        if (!classId || !date || !Array.isArray(attendanceData)) {
            return res.status(400).json({ success: false, message: 'classId, date, and attendanceData are required.' });
        }

        await client.query('BEGIN');

        for (const record of attendanceData) {
            await client.query(
                `INSERT INTO attendance (student_id, class_id, date, status)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (student_id, date) DO UPDATE SET status = $4, class_id = $2`,
                [record.studentId, classId, date, record.status]
            );
        }

        await client.query('COMMIT');
        return res.status(200).json({ success: true, message: 'Attendance saved successfully.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Submit Attendance Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to save attendance.' });
    } finally {
        client.release();
    }
};

// GET /api/teacher-portal/leaves
exports.getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.id;
        let leaves = [];
        try {
            const leavesRes = await pool.query(
                `SELECT id, leave_type, start_date, end_date, reason, status, created_at
                 FROM leaves
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT 20`,
                [userId]
            );
            leaves = leavesRes.rows;
        } catch(e) { leaves = []; }

        return res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        console.error('Get Leaves Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch leaves.' });
    }
};

// POST /api/teacher-portal/leaves
exports.applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leave_type, start_date, end_date, reason } = req.body;

        if (!leave_type || !start_date || !end_date || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        let newLeave;
        try {
            const result = await pool.query(
                `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status)
                 VALUES ($1, $2, $3, $4, $5, 'Pending')
                 RETURNING *`,
                [userId, leave_type, start_date, end_date, reason]
            );
            newLeave = result.rows[0];
        } catch(e) {
            // Table might have different column names
            const result = await pool.query(
                `INSERT INTO leaves (user_id, type, from_date, to_date, reason, status)
                 VALUES ($1, $2, $3, $4, $5, 'Pending')
                 RETURNING *`,
                [userId, leave_type, start_date, end_date, reason]
            );
            newLeave = result.rows[0];
        }

        return res.status(201).json({ success: true, message: 'Leave application submitted.', data: newLeave });
    } catch (error) {
        console.error('Apply Leave Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to apply for leave.' });
    }
};

// ============================================================
// PHASE 2: ACADEMIC CORE
// ============================================================

// GET /api/teacher-portal/exams - Get exams where teacher can enter marks
exports.getMyExams = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id || null;

        let exams = [];
        try {
            exams = (await pool.query(
                `SELECT e.id, e.name, e.exam_type, e.start_date, e.end_date, e.max_marks, e.passing_marks, e.status,
                        c.name as class_name, c.section, s.name as subject_name
                 FROM exams e
                 JOIN classes c ON e.class_id = c.id
                 JOIN subjects s ON e.subject_id = s.id
                 WHERE e.school_id = $1
                 ORDER BY e.start_date DESC LIMIT 30`,
                [schoolId]
            )).rows;
        } catch(e) {
            exams = (await pool.query(
                `SELECT id, name, exam_type, start_date, end_date, max_marks, passing_marks, status
                 FROM exams WHERE school_id = $1 ORDER BY start_date DESC LIMIT 20`,
                [schoolId]
            )).rows;
        }

        return res.status(200).json({ success: true, data: exams });
    } catch (error) {
        console.error('Get Exams Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch exams.' });
    }
};

// GET /api/teacher-portal/exam-students/:examId - Students for marks entry
exports.getExamStudents = async (req, res) => {
    try {
        const { examId } = req.params;

        // Get exam details first
        let exam = null;
        try {
            exam = (await pool.query(`SELECT * FROM exams WHERE id = $1`, [examId])).rows[0];
        } catch(e) { exam = null; }

        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

        // Get students in the exam's class with existing marks
        let students = [];
        try {
            students = (await pool.query(
                `SELECT s.id, s.name, s.roll_number,
                        r.theory_marks, r.practical_marks, r.total_marks, r.grade, r.remarks
                 FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id AND sc.class_id = $1
                 LEFT JOIN results r ON r.student_id = s.id AND r.exam_id = $2
                 ORDER BY s.roll_number`,
                [exam.class_id, examId]
            )).rows;
        } catch(e) {
            students = (await pool.query(
                `SELECT s.id, s.name, s.roll_number FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id AND sc.class_id = $1
                 ORDER BY s.roll_number`,
                [exam.class_id]
            )).rows;
        }

        return res.status(200).json({ success: true, data: { exam, students } });
    } catch (error) {
        console.error('Get Exam Students Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch exam students.' });
    }
};

// POST /api/teacher-portal/save-marks - Bulk save marks
exports.saveMarks = async (req, res) => {
    const client = await pool.connect();
    try {
        const { examId, marksData } = req.body;
        // marksData: [{ studentId, theoryMarks, practicalMarks }]

        if (!examId || !Array.isArray(marksData)) {
            return res.status(400).json({ success: false, message: 'examId and marksData required.' });
        }

        const exam = (await pool.query(`SELECT * FROM exams WHERE id = $1`, [examId])).rows[0];
        const maxMarks = exam?.max_marks || 100;

        const getGrade = (total) => {
            if (total >= 91) return 'A1';
            if (total >= 81) return 'A2';
            if (total >= 71) return 'B1';
            if (total >= 61) return 'B2';
            if (total >= 51) return 'C1';
            if (total >= 41) return 'C2';
            if (total >= 33) return 'D';
            return 'F';
        };

        await client.query('BEGIN');
        for (const m of marksData) {
            const theory = parseFloat(m.theoryMarks) || 0;
            const practical = parseFloat(m.practicalMarks) || 0;
            const total = theory + practical;
            const pct = (total / maxMarks) * 100;
            const grade = getGrade(pct);

            await client.query(
                `INSERT INTO results (student_id, exam_id, theory_marks, practical_marks, total_marks, grade, status)
                 VALUES ($1, $2, $3, $4, $5, $6, 'Submitted')
                 ON CONFLICT (student_id, exam_id) DO UPDATE 
                 SET theory_marks = $3, practical_marks = $4, total_marks = $5, grade = $6, status = 'Submitted'`,
                [m.studentId, examId, theory, practical, total, grade]
            );
        }
        await client.query('COMMIT');

        return res.status(200).json({ success: true, message: 'Marks saved successfully.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Save Marks Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to save marks. ' + error.message });
    } finally {
        client.release();
    }
};

// GET /api/teacher-portal/assignments - Get assignments created by this teacher
exports.getMyAssignments = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id || null;

        let assignments = [];
        try {
            assignments = (await pool.query(
                `SELECT h.id, h.title, h.description, h.due_date, h.max_marks, h.status, h.created_at,
                        c.name as class_name, c.section,
                        s.name as subject_name,
                        COUNT(hs.id) FILTER (WHERE hs.submitted_at IS NOT NULL) as submitted_count,
                        COUNT(sc.student_id) as total_students
                 FROM homeworks h
                 JOIN classes c ON h.class_id = c.id
                 LEFT JOIN subjects s ON h.subject_id = s.id
                 LEFT JOIN homework_submissions hs ON hs.homework_id = h.id
                 LEFT JOIN student_classes sc ON sc.class_id = h.class_id
                 WHERE h.teacher_id = $1
                 GROUP BY h.id, c.name, c.section, s.name
                 ORDER BY h.created_at DESC LIMIT 30`,
                [teacherId]
            )).rows;
        } catch(e) {
            assignments = (await pool.query(
                `SELECT id, title, description, due_date, max_marks, status, created_at
                 FROM homeworks WHERE teacher_id = $1 ORDER BY created_at DESC LIMIT 20`,
                [teacherId]
            )).rows;
        }

        return res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        console.error('Get Assignments Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch assignments.' });
    }
};

// POST /api/teacher-portal/assignments - Create new assignment
exports.createAssignment = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { title, description, class_id, subject_id, due_date, max_marks } = req.body;

        if (!title || !class_id || !due_date) {
            return res.status(400).json({ success: false, message: 'title, class_id and due_date are required.' });
        }

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;
        if (!teacherId) return res.status(404).json({ success: false, message: 'Teacher not found.' });

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO homeworks (teacher_id, class_id, subject_id, title, description, due_date, max_marks, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active') RETURNING *`,
                [teacherId, class_id, subject_id || null, title, description || '', due_date, max_marks || 10]
            )).rows[0];
        } catch(e) {
            result = (await pool.query(
                `INSERT INTO homeworks (teacher_id, class_id, title, description, due_date, max_marks)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [teacherId, class_id, title, description || '', due_date, max_marks || 10]
            )).rows[0];
        }

        return res.status(201).json({ success: true, message: 'Assignment created.', data: result });
    } catch (error) {
        console.error('Create Assignment Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create assignment. ' + error.message });
    }
};

// GET /api/teacher-portal/syllabus - Get syllabus progress
exports.getSyllabusProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let progress = [];
        try {
            progress = (await pool.query(
                `SELECT sp.id, sp.subject_id, sp.class_id, sp.chapter_name, sp.topic_name,
                        sp.is_completed, sp.completion_date, sp.notes,
                        s.name as subject_name, c.name as class_name, c.section
                 FROM syllabus_progress sp
                 JOIN subjects s ON sp.subject_id = s.id
                 JOIN classes c ON sp.class_id = c.id
                 WHERE sp.teacher_id = $1
                 ORDER BY s.name, sp.chapter_name, sp.topic_name`,
                [teacherId]
            )).rows;
        } catch(e) { progress = []; }

        return res.status(200).json({ success: true, data: progress });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch syllabus.' });
    }
};

// POST /api/teacher-portal/syllabus - Create or update topic progress
exports.updateSyllabusProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { subject_id, class_id, chapter_name, topic_name, is_completed, notes } = req.body;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;
        if (!teacherId) return res.status(404).json({ success: false, message: 'Teacher not found.' });

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO syllabus_progress (teacher_id, subject_id, class_id, chapter_name, topic_name, is_completed, completion_date, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (teacher_id, subject_id, class_id, chapter_name, topic_name) 
                 DO UPDATE SET is_completed = $6, completion_date = $7, notes = $8
                 RETURNING *`,
                [teacherId, subject_id, class_id, chapter_name, topic_name, is_completed, is_completed ? new Date() : null, notes || '']
            )).rows[0];
        } catch(e) {
            // Create table if not exists and retry with simpler insert
            await pool.query(`CREATE TABLE IF NOT EXISTS syllabus_progress (
                id SERIAL PRIMARY KEY,
                teacher_id INT, subject_id INT, class_id INT,
                chapter_name VARCHAR(255), topic_name VARCHAR(255),
                is_completed BOOLEAN DEFAULT FALSE,
                completion_date DATE, notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(teacher_id, subject_id, class_id, chapter_name, topic_name)
            )`);
            result = (await pool.query(
                `INSERT INTO syllabus_progress (teacher_id, subject_id, class_id, chapter_name, topic_name, is_completed, completion_date, notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                 ON CONFLICT (teacher_id, subject_id, class_id, chapter_name, topic_name) 
                 DO UPDATE SET is_completed = $6, completion_date = $7, notes = $8
                 RETURNING *`,
                [teacherId, subject_id, class_id, chapter_name, topic_name, is_completed, is_completed ? new Date() : null, notes || '']
            )).rows[0];
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Syllabus Update Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update syllabus. ' + error.message });
    }
};

// GET /api/teacher-portal/diary - Lesson plan diary
exports.getMyDiary = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let entries = [];
        try {
            entries = (await pool.query(
                `SELECT ld.id, ld.date, ld.topics_covered, ld.topics_planned, ld.homework_assigned,
                        ld.class_behavior, ld.special_notes, ld.created_at,
                        c.name as class_name, c.section, s.name as subject_name
                 FROM lesson_diary ld
                 JOIN classes c ON ld.class_id = c.id
                 LEFT JOIN subjects s ON ld.subject_id = s.id
                 WHERE ld.teacher_id = $1
                 ORDER BY ld.date DESC, ld.created_at DESC
                 LIMIT 30`,
                [teacherId]
            )).rows;
        } catch(e) { entries = []; }

        return res.status(200).json({ success: true, data: entries });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch diary.' });
    }
};

// POST /api/teacher-portal/diary - Submit lesson plan entry
exports.submitDiaryEntry = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { date, class_id, subject_id, topics_covered, topics_planned, homework_assigned, class_behavior, special_notes } = req.body;

        if (!date || !class_id || !topics_covered) {
            return res.status(400).json({ success: false, message: 'date, class_id and topics_covered are required.' });
        }

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;
        if (!teacherId) return res.status(404).json({ success: false, message: 'Teacher not found.' });

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO lesson_diary (teacher_id, class_id, subject_id, date, topics_covered, topics_planned, homework_assigned, class_behavior, special_notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (teacher_id, class_id, date) DO UPDATE
                 SET topics_covered = $5, topics_planned = $6, homework_assigned = $7, class_behavior = $8, special_notes = $9
                 RETURNING *`,
                [teacherId, class_id, subject_id || null, date, topics_covered, topics_planned || '', homework_assigned || '', class_behavior || 'Good', special_notes || '']
            )).rows[0];
        } catch(e) {
            // Create table if missing
            await pool.query(`CREATE TABLE IF NOT EXISTS lesson_diary (
                id SERIAL PRIMARY KEY,
                teacher_id INT, class_id INT, subject_id INT, date DATE,
                topics_covered TEXT, topics_planned TEXT, homework_assigned TEXT,
                class_behavior VARCHAR(50) DEFAULT 'Good', special_notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                UNIQUE(teacher_id, class_id, date)
            )`);
            result = (await pool.query(
                `INSERT INTO lesson_diary (teacher_id, class_id, subject_id, date, topics_covered, topics_planned, homework_assigned, class_behavior, special_notes)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (teacher_id, class_id, date) DO UPDATE
                 SET topics_covered = $5, topics_planned = $6, homework_assigned = $7, class_behavior = $8, special_notes = $9
                 RETURNING *`,
                [teacherId, class_id, subject_id || null, date, topics_covered, topics_planned || '', homework_assigned || '', class_behavior || 'Good', special_notes || '']
            )).rows[0];
        }

        return res.status(201).json({ success: true, message: 'Diary entry saved.', data: result });
    } catch (error) {
        console.error('Diary Entry Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to save diary entry. ' + error.message });
    }
};
// GET /api/teacher-portal/timetable - Fetch teacher's timetable
exports.getMyTimetable = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t 
             JOIN users u ON t.user_id = u.id 
             WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        if (!teacherRes.rows.length) {
            return res.status(200).json({ success: true, data: [] });
        }
        const teacherId = teacherRes.rows[0].id;

        let timetable = [];
        try {
            const ttRes = await pool.query(
                `SELECT t.id, t.day_of_week, t.period_number, t.start_time, t.end_time,
                        c.name as class_name, c.section,
                        s.name as subject_name
                 FROM timetable t
                 JOIN classes c ON t.class_id = c.id
                 JOIN subjects s ON t.subject_id = s.id
                 WHERE t.teacher_id = $1
                 ORDER BY CASE t.day_of_week 
                    WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 
                    WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 ELSE 7 END,
                 t.period_number`,
                [teacherId]
            );
            timetable = ttRes.rows;
        } catch(e) { timetable = []; }

        return res.status(200).json({ success: true, data: timetable });
    } catch (error) {
        console.error('Get Timetable Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch timetable.' });
    }
};


// ============================================================
// PHASE 3: COMMUNICATION, ANALYTICS & BEHAVIOR
// Appended to existing teacherPortalController.js
// ============================================================

// GET /api/teacher-portal/student-performance?classId=X
exports.getStudentPerformance = async (req, res) => {
    try {
        const { classId } = req.query;
        const schoolId = req.user.schoolId;

        if (!classId) return res.status(400).json({ success: false, message: 'classId is required.' });

        let students = [];
        try {
            students = (await pool.query(
                `SELECT s.id, s.name, s.roll_number, s.photo,
                        COALESCE(AVG(r.total_marks), 0) as avg_marks,
                        COALESCE(MAX(r.total_marks), 0) as max_marks,
                        COUNT(DISTINCT r.exam_id) as exams_given,
                        ROUND(COUNT(att.id) FILTER (WHERE att.status = 'Present') * 100.0 / NULLIF(COUNT(att.id), 0), 1) as attendance_pct
                 FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id AND sc.class_id = $1
                 LEFT JOIN results r ON r.student_id = s.id
                 LEFT JOIN attendance att ON att.student_id = s.id
                 GROUP BY s.id, s.name, s.roll_number, s.photo
                 ORDER BY avg_marks DESC`,
                [classId]
            )).rows;
        } catch(e) {
            students = (await pool.query(
                `SELECT s.id, s.name, s.roll_number FROM students s
                 JOIN student_classes sc ON sc.student_id = s.id AND sc.class_id = $1
                 ORDER BY s.roll_number`,
                [classId]
            )).rows;
        }

        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error('Student Performance Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch performance.' });
    }
};

// POST /api/teacher-portal/student-remark - Add remark/reward to a student
exports.addStudentRemark = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { student_id, remark_type, remark, recommendation } = req.body;

        if (!student_id || !remark_type || !remark) {
            return res.status(400).json({ success: false, message: 'student_id, remark_type and remark are required.' });
        }

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO student_remarks (teacher_id, student_id, remark_type, remark, recommendation, created_at)
                 VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
                [teacherId, student_id, remark_type, remark, recommendation || '']
            )).rows[0];
        } catch(e) {
            // Create table if not exists
            await pool.query(`CREATE TABLE IF NOT EXISTS student_remarks (
                id SERIAL PRIMARY KEY,
                teacher_id INT, student_id INT, remark_type VARCHAR(50),
                remark TEXT, recommendation TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )`);
            result = (await pool.query(
                `INSERT INTO student_remarks (teacher_id, student_id, remark_type, remark, recommendation, created_at)
                 VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
                [teacherId, student_id, remark_type, remark, recommendation || '']
            )).rows[0];
        }

        return res.status(201).json({ success: true, message: 'Remark added.', data: result });
    } catch (error) {
        console.error('Student Remark Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to add remark. ' + error.message });
    }
};

// GET /api/teacher-portal/behavior-log?classId=X
exports.getBehaviorLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { classId } = req.query;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let logs = [];
        try {
            const where = classId
                ? `WHERE bl.teacher_id = $1 AND sc.class_id = $2`
                : `WHERE bl.teacher_id = $1`;
            const params = classId ? [teacherId, classId] : [teacherId];
            logs = (await pool.query(
                `SELECT bl.id, bl.incident_type, bl.description, bl.action_taken, bl.date, bl.created_at,
                        s.name as student_name, s.roll_number,
                        c.name as class_name, c.section
                 FROM behavior_log bl
                 JOIN students s ON bl.student_id = s.id
                 LEFT JOIN student_classes sc ON sc.student_id = s.id
                 LEFT JOIN classes c ON sc.class_id = c.id
                 ${where}
                 ORDER BY bl.date DESC LIMIT 30`,
                params
            )).rows;
        } catch(e) { logs = []; }

        return res.status(200).json({ success: true, data: logs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch behavior log.' });
    }
};

// POST /api/teacher-portal/behavior-log - Log a behavior incident
exports.addBehaviorLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { student_id, incident_type, description, action_taken, date } = req.body;

        if (!student_id || !incident_type || !description) {
            return res.status(400).json({ success: false, message: 'student_id, incident_type and description are required.' });
        }

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO behavior_log (teacher_id, student_id, incident_type, description, action_taken, date)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [teacherId, student_id, incident_type, description, action_taken || '', date || new Date()]
            )).rows[0];
        } catch(e) {
            await pool.query(`CREATE TABLE IF NOT EXISTS behavior_log (
                id SERIAL PRIMARY KEY,
                teacher_id INT, student_id INT, incident_type VARCHAR(100),
                description TEXT, action_taken TEXT, date DATE DEFAULT CURRENT_DATE,
                created_at TIMESTAMP DEFAULT NOW()
            )`);
            result = (await pool.query(
                `INSERT INTO behavior_log (teacher_id, student_id, incident_type, description, action_taken, date)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [teacherId, student_id, incident_type, description, action_taken || '', date || new Date()]
            )).rows[0];
        }

        return res.status(201).json({ success: true, message: 'Behavior logged.', data: result });
    } catch (error) {
        console.error('Behavior Log Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to log behavior. ' + error.message });
    }
};

// GET /api/teacher-portal/ptm-meetings - Get scheduled PTM meetings
exports.getPTMMeetings = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;

        let meetings = [];
        try {
            meetings = (await pool.query(
                `SELECT pm.id, pm.meeting_date, pm.meeting_time, pm.agenda, pm.status, pm.notes, pm.created_at,
                        s.name as student_name, s.roll_number,
                        c.name as class_name, c.section
                 FROM ptm_meetings pm
                 JOIN students s ON pm.student_id = s.id
                 LEFT JOIN student_classes sc ON sc.student_id = s.id
                 LEFT JOIN classes c ON sc.class_id = c.id
                 WHERE pm.teacher_id = $1
                 ORDER BY pm.meeting_date DESC LIMIT 20`,
                [teacherId]
            )).rows;
        } catch(e) { meetings = []; }

        return res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch PTM meetings.' });
    }
};

// POST /api/teacher-portal/ptm-meetings - Schedule a PTM meeting
exports.schedulePTM = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.schoolId;
        const { student_id, meeting_date, meeting_time, agenda } = req.body;

        if (!student_id || !meeting_date || !agenda) {
            return res.status(400).json({ success: false, message: 'student_id, meeting_date and agenda are required.' });
        }

        const teacherRes = await pool.query(
            `SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.id = $1 AND t.school_id = $2`,
            [userId, schoolId]
        );
        const teacherId = teacherRes.rows?.[0]?.id;
        if (!teacherId) return res.status(404).json({ success: false, message: 'Teacher not found.' });

        let result;
        try {
            result = (await pool.query(
                `INSERT INTO ptm_meetings (teacher_id, student_id, meeting_date, meeting_time, agenda, status)
                 VALUES ($1, $2, $3, $4, $5, 'Scheduled') RETURNING *`,
                [teacherId, student_id, meeting_date, meeting_time || '10:00', agenda]
            )).rows[0];
        } catch(e) {
            await pool.query(`CREATE TABLE IF NOT EXISTS ptm_meetings (
                id SERIAL PRIMARY KEY,
                teacher_id INT, student_id INT, meeting_date DATE, meeting_time TIME,
                agenda TEXT, status VARCHAR(50) DEFAULT 'Scheduled', notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )`);
            result = (await pool.query(
                `INSERT INTO ptm_meetings (teacher_id, student_id, meeting_date, meeting_time, agenda, status)
                 VALUES ($1, $2, $3, $4, $5, 'Scheduled') RETURNING *`,
                [teacherId, student_id, meeting_date, meeting_time || '10:00', agenda]
            )).rows[0];
        }

        return res.status(201).json({ success: true, message: 'PTM scheduled.', data: result });
    } catch (error) {
        console.error('Schedule PTM Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to schedule PTM. ' + error.message });
    }
};

// GET /api/teacher-portal/students-by-class?classId=X  (for dropdowns in Phase 3 forms)
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ success: false, message: 'classId required.' });

        const students = (await pool.query(
            `SELECT s.id, s.name, s.roll_number FROM students s
             JOIN student_classes sc ON sc.student_id = s.id AND sc.class_id = $1
             ORDER BY s.roll_number`,
            [classId]
        )).rows;

        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch students.' });
    }
};

// POST /api/teacher-portal/mark-attendance-qr
exports.markAttendanceQR = async (req, res) => {
    try {
        const pool = require('../config/db');
        const { qrToken } = req.body;
        const schoolId = req.user.schoolId;
        const teacherId = req.user.id;
        
        if (!qrToken) return res.status(400).json({ success: false, message: 'QR Token is required' });
        
        const dateStr = new Date().toISOString().split('T')[0];
        
        // Check if QR token matches the one in DB for today
        const qrRes = await pool.query(
            `SELECT * FROM daily_attendance_qr WHERE school_id = $1 AND date = $2 AND token = $3`,
            [schoolId, dateStr, qrToken]
        );
        
        if (qrRes.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired QR code.' });
        }
        
        // Ensure teacher_attendance table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teacher_attendance (
                id SERIAL PRIMARY KEY,
                school_id INTEGER,
                teacher_id INTEGER,
                date DATE,
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(teacher_id, date)
            )
        `);
        
        await pool.query(
            `INSERT INTO teacher_attendance (school_id, teacher_id, date, status) 
             VALUES ($1, $2, $3, 'Present') 
             ON CONFLICT (teacher_id, date) DO UPDATE SET status = 'Present'`,
            [schoolId, teacherId, dateStr]
        );
        
        return res.status(200).json({ success: true, message: 'Attendance marked successfully!' });
    } catch (error) {
        console.error('Mark Attendance QR Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to mark attendance via QR.' });
    }
};
