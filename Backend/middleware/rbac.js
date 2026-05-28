// Middleware for Role-Based Access Control
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // req.user is set by the auth middleware (jwt verification)
            if (!req.user || !req.user.role) {
                return res.status(401).json({
                    success: false,
                    message: "User role not found. Please authenticate first."
                });
            }

            const userRole = req.user.role; // This comes from the JWT payload

            // Check if the user's role is in the array of allowed roles
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Role: ${userRole} is not allowed to access this resource. Requires: ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Role authorization failed"
            });
        }
    };
};

// Hierarchy Check: Prevent lower roles from managing higher roles
exports.canManageRole = (creatorRoleRaw, targetRole) => {
    const creatorRole = creatorRoleRaw?.toLowerCase().replace(/\s+/g, '');
    
    // Super Admin can create School Admin
    if (creatorRole === "superadmin" && targetRole === "School Admin") return true;

    // School Admin can create ANY of the 8 roles below them
    const schoolAdminTargets = [
        "Principal", "Teacher", "Student", "Parent", 
        "Accountant", "Librarian", "Transport Manager", "Receptionist"
    ];
    if (creatorRole === "schooladmin" && schoolAdminTargets.includes(targetRole)) return true;

    // Principal creates Staff, Students, and Parents
    const principalTargets = ["Teacher", "Student", "Parent", "Accountant", "Librarian", "Transport Manager", "Receptionist"];
    if (creatorRole === "principal" && principalTargets.includes(targetRole)) return true;

    // Fail otherwise
    return false;
};

// Check specific module permissions
const permissions = require('../config/permissions');

exports.checkPermission = (moduleName, action) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(401).json({ success: false, message: "Unauthenticated" });
            }
            
            // Normalize role matching to handle DB variants like "superAdmin", "School Admin"
            const userRoleRaw = req.user.role;
            // Map the raw role to the exact keys in permissions.js
            let exactRole = Object.keys(permissions).find(r => r.toLowerCase().replace(/\s+/g, '') === userRoleRaw.toLowerCase().replace(/\s+/g, ''));
            
            if (!exactRole) {
                return res.status(403).json({ success: false, message: "Invalid role" });
            }

            const rolePerms = permissions[exactRole];
            
            if (rolePerms._all && rolePerms._all.includes(action)) {
                return next();
            }

            const modulePerms = rolePerms[moduleName];
            if (!modulePerms || !modulePerms.includes(action)) {
                return res.status(403).json({ success: false, message: `Access denied. ${exactRole} does not have '${action}' permission for '${moduleName}'` });
            }

            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: "Permission authorization failed" });
        }
    };
};
