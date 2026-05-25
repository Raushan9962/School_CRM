const prisma = require('../config/prismaClient');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const checkUserPresent = await prisma.user.findUnique({ where: { email } });

        // If user already exists, then return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Check if OTP is unique
        let result = await prisma.oTP.findFirst({ where: { otp } });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await prisma.oTP.findFirst({ where: { otp } });
        }

        const otpPayload = { email, otp };

        // Create an entry in db for OTP
        const otpBody = await prisma.oTP.create({ data: otpPayload });
        console.log(otpBody);

        // Return successful response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Signup
exports.signUp = async (req, res) => {
    try {
        // Data fetch from request body
        const { 
            firstName, lastName, email, password, confirmPassword, 
            accountType, contactNumber, otp 
        } = req.body;

        // Validate
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirmPassword do not match, please try again"
            });
        }

        // Check user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        // Find most recent OTP stored for user
        const recentOtpRecord = await prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });

        // Validate OTP
        if (!recentOtpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        } else if (otp !== recentOtpRecord.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Combine firstName and lastName for Prisma User 'name'
        const fullName = `${firstName} ${lastName}`;
        
        // Generate profile image
        const image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;

        // Create entry in Db
        // We assume accountType maps directly to roleId (e.g. 1 = Admin, 2 = Student, 3 = Teacher)
        // If accountType is string, you might want to fetch Role by name:
        let role = await prisma.role.findUnique({ where: { name: accountType } });
        if (!role) {
            // Default fallback if role doesn't exist, create it or fail
            // For now, let's create it or assume roleId = 1
            role = await prisma.role.create({ data: { name: accountType } });
        }

        const user = await prisma.user.create({
            data: {
                name: fullName,
                email,
                phone: contactNumber,
                password: hashedPassword,
                roleId: role.id,
                image: image
            }
        });

        // Optionally, if role is Student, create Student record...
        // For now we keep it aligned with your original Mongoose logic

        // Return response
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User registration failed"
        });
    }
};

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

        // Check if user exists
        const user = await prisma.user.findUnique({ 
            where: { email },
            include: { role: true }
        });

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
                role: user.role.name, // or user.roleId
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: "2h",
            });
            
            user.token = token;
            user.password = undefined; // Don't send password to client

            // Create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            
            res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
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
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // Check old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Old password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

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
