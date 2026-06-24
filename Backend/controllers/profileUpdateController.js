const pool = require('../config/db');

exports.createRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { changes } = req.body;

        if (!changes || Object.keys(changes).length === 0) {
            return res.status(400).json({ success: false, message: "No changes provided" });
        }

        const result = await pool.query(
            `INSERT INTO profile_update_requests (user_id, requested_changes) VALUES ($1, $2) RETURNING *`,
            [userId, JSON.stringify(changes)]
        );

        res.status(201).json({ success: true, message: "Profile update request submitted successfully", data: result.rows[0] });
    } catch (error) {
        console.error("Error creating profile update request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.name, u.email, u.role_name, s.admission_no 
            FROM profile_update_requests p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN students s ON u.id = s.user_id
            WHERE p.status = 'Pending'
            ORDER BY p.created_at DESC
        `);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Error fetching profile update requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.processRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'Approve' or 'Reject'

        if (!['Approve', 'Reject'].includes(action)) {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

        const requestCheck = await pool.query(`SELECT * FROM profile_update_requests WHERE id = $1 AND status = 'Pending'`, [id]);
        if (requestCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found or already processed" });
        }

        const requestData = requestCheck.rows[0];
        const changes = requestData.requested_changes;
        const userId = requestData.user_id;

        if (action === 'Approve') {
            // Process the updates (assuming changes has fields like phone, address, etc.)
            let updateFields = [];
            let updateValues = [];
            let index = 1;

            if (changes.phone) {
                updateFields.push(`phone = $${index++}`);
                updateValues.push(changes.phone);
            }
            if (changes.address) {
                updateFields.push(`address = $${index++}`);
                updateValues.push(changes.address);
            }
            if (changes.gender) {
                updateFields.push(`gender = $${index++}`);
                updateValues.push(changes.gender);
            }

            if (updateFields.length > 0) {
                updateValues.push(userId);
                const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${index}`;
                await pool.query(query, updateValues);
                
                // Note: If you want to update specific student fields (like parent_phone), you can also do it here:
                if (changes.phone) {
                   await pool.query(`UPDATE students SET parent_phone = $1 WHERE user_id = $2`, [changes.phone, userId]);
                }
            }
        }

        // Mark as resolved
        await pool.query(
            `UPDATE profile_update_requests SET status = $1, resolved_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [action === 'Approve' ? 'Approved' : 'Rejected', id]
        );

        res.status(200).json({ success: true, message: `Request ${action.toLowerCase()}d successfully` });
    } catch (error) {
        console.error("Error processing profile update request:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
