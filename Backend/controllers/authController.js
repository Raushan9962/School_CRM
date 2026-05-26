const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login
exports.login = async (req, res) => {
    try {
        // Get data from req body
        const { email, password } = req.body;

        // Validate data
        if (!email || !password) {
            return res.status(403).json({
                success: false, 
                message: "All fields are required, please try again",
            });
        }

        // Check if user exists, also join with roles table to get role name
        const user = await User.findByEmailWithRole(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        // Generate JWT after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user.id,
                role: user.roleName, // From the JOIN
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: "2h",
            });
            
            // Set token and remove password from response object
            user.token = token;
            delete user.password;

            // Create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user: user,
                message: "Logged in successfully",
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed, please try again',
        });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        // Get data from req.body
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.id; // From auth middleware

        // Validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "New passwords do not match" });
        }

        // Get user from DB
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Old password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        await User.updatePassword(userId, hashedNewPassword);

        // Send mail-password updated (Placeholder for NodeMailer logic)
        // await mailSender(user.email, "Password Updated", "Your password has been successfully updated.");

        // Return response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error updating password" });
    }
};
