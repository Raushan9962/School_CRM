const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication Middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from cookies, body, or header
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decode; // Attach decoded token payload (email, id, role) to req.user
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
};

// Authorization Middlewares
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.role !== "Student" && req.user.role !== "student") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Students only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        });
    }
};

exports.isTeacher = async (req, res, next) => {
    try {
        if (req.user.role !== "Teacher" && req.user.role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Teachers only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "Admin" && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "This is a protected route for Admins only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified"
        });
    }
};