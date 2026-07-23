from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    label = 'accounts'  # Keep 'accounts' label for migration compatibility
    verbose_name = 'Authentication'
