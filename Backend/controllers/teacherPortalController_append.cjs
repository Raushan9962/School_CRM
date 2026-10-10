

// ==========================================
// Parent Interaction APIs
// ==========================================

exports.getParents = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        // Fetch parents for students in this school
        const result = await pool.query(`
            SELECT 
                p.id as parent_id, 
                u.name as parent_name, 
                u.email, 
                u.phone,
                s.name as student_name,
                c.name as class_name,
                c.section
            FROM parents p
            JOIN users u ON p.user_id = u.id
            JOIN students s ON p.student_id = s.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE u.school_id = $1
        `, [schoolId]);

        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching parents:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const teacherId = req.user.id;
        const parentId = req.params.parentId;

        const result = await pool.query(`
            SELECT * FROM parent_teacher_messages 
            WHERE school_id = $1 AND teacher_id = $2 AND parent_id = $3
            ORDER BY sent_at ASC
        `, [schoolId, teacherId, parentId]);

        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const teacherId = req.user.id;
        const { parent_id, message } = req.body;

        if (!parent_id || !message) {
            return res.status(400).json({ success: false, message: 'Missing parent ID or message' });
        }

        const result = await pool.query(`
            INSERT INTO parent_teacher_messages (school_id, teacher_id, parent_id, sender_type, message)
            VALUES ($1, $2, $3, 'teacher', $4)
            RETURNING *
        `, [schoolId, teacherId, parent_id, message]);

        return res.status(201).json({ success: true, data: result.rows[0], message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
