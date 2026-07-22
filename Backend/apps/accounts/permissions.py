from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to Super Admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'SUPER_ADMIN'
        )

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to Admins.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'ADMIN'
        )

class IsTeacher(permissions.BasePermission):
    """
    Allows access only to Teachers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'TEACHER'
        )

class IsStudent(permissions.BasePermission):
    """
    Allows access only to Students.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'STUDENT'
        )

class HasRole:
    """
    Factory function to dynamically create a permission class for specific roles.
    Example usage in view: permission_classes = [HasRole('ADMIN', 'TEACHER')]
    """
    def __new__(cls, *roles):
        class DynamicRolePermission(permissions.BasePermission):
            def has_permission(self, request, view):
                if not (request.user and request.user.is_authenticated):
                    return False
                
                # Normalize user role and allowed roles for flexible checking
                normalized_user_role = (request.user.role or '').upper().replace(' ', '_')
                normalized_allowed_roles = [r.upper().replace(' ', '_') for r in roles]
                
                return normalized_user_role in normalized_allowed_roles
                
        return DynamicRolePermission
