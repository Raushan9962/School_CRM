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
exports.canManageRole = (creatorRole, targetRole) => {
    const roleHierarchy = {
        "Super Admin": 100,
        "School Admin": 90,
        "Principal": 80,
        "Accountant": 70,
        "Transport Manager": 70,
        "Librarian": 70,
        "Receptionist": 70,
        "Teacher": 60,
        "Student": 10,
        "Parent": 10
    };

    const creatorLevel = roleHierarchy[creatorRole] || 0;
    const targetLevel = roleHierarchy[targetRole] || 0;

    // Special Rules Based on User's Request:
    // 1. Super Admin creates School Admin
    if (creatorRole === "Super Admin" && targetRole === "School Admin") return true;
    
    // 2. School Admin creates Principal
    if (creatorRole === "School Admin" && targetRole === "Principal") return true;

    // 3. Principal creates Staff, Students, and Parents
    const principalTargets = ["Teacher", "Student", "Parent", "Accountant", "Librarian", "Transport Manager", "Receptionist"];
    if (creatorRole === "Principal" && principalTargets.includes(targetRole)) return true;

    // Fail otherwise
    return false;
};
