from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'tipo', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Informações adicionais', {'fields': ('tipo',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações adicionais', {'fields': ('tipo',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
