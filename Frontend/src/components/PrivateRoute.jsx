import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — Protects routes from unauthenticated access.
 * - If no token found in localStorage → redirects to /login/student
 * - Optionally checks if the logged-in user's role matches allowedRoles
 * - If allowedRoles provided and role doesn't match → redirects to /login/student
 */
const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return <Navigate to="/login/student" replace />;
    }

    if (allowedRoles.length > 0) {
        try {
            const user = JSON.parse(userStr);
            const rawRole = user?.role || user?.roleName || '';
            const role = rawRole.toLowerCase().replace(/\s+/g, '');
            if (!allowedRoles.includes(role)) {
                return <Navigate to="/login/student" replace />;
            }
        } catch (e) {
            return <Navigate to="/login/student" replace />;
        }
    }

    return children;
};

export default PrivateRoute;
