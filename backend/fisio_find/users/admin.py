from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    AppUser, Patient, 
    Physiotherapist, 
    Admin, Specialization, 
    PhysiotherapistSpecialization, 
    Pricing,EncryptedValues 
)
from .forms import AppUserCreationForm, AppUserChangeForm


class AppUserAdmin(BaseUserAdmin):
    add_form = AppUserCreationForm
    form = AppUserChangeForm
    model = AppUser

    list_display = ['id', 'username', 'first_name', 'email', 'account_status']

    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {
            'fields': ('photo', 'dni', 'phone_number', 'postal_code', 'account_status'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'dni', 'email', 'password1', 'password2',
                'photo', 'phone_number', 'postal_code', 'account_status',
            ),
        }),
    )

    search_fields = ('username', 'first_name', 'last_name', 'email', 'account_status')
    list_filter = ('account_status', 'is_staff', 'is_active', 'groups')


class PatientAdmin(admin.ModelAdmin):
    search_fields = ['user__email', 'user__username', 'user__first_name', 'user__last_name', 'gender']
    list_filter = ['gender']
    list_display = ['id', 'user__username', 'user__first_name', 'user__last_name', 'user__email']


class PhysioAdmin(admin.ModelAdmin):
    search_fields = ['user__email', 'user__username', 'user__first_name', 'user__last_name', 'gender',
                     'autonomic_community', 'collegiate_number']
    list_filter = ['gender', 'autonomic_community']
    list_display = ['id', 'user__username', 'user__email', 'collegiate_number', 'autonomic_community']


# New admin class for Video model
class VideoAdmin(admin.ModelAdmin):
    search_fields = ['title', 'description', 'physiotherapist__user__username', 'physiotherapist__user__email']
    list_filter = ['uploaded_at']
    list_display = ['id', 'title', 'get_physiotherapist', 'uploaded_at']

    def get_physiotherapist(self, obj):
        return obj.physiotherapist.user.username
    get_physiotherapist.short_description = 'Physiotherapist'
    get_physiotherapist.admin_order_field = 'physiotherapist__user__username'


# New admin class for PatientFile model
class PatientFileAdmin(admin.ModelAdmin):
    search_fields = ['title', 'description', 'patient__user__username', 'patient__user__email', 'file_type']
    list_filter = ['uploaded_at', 'file_type']
    list_display = ['id', 'title', 'get_patient', 'file_type', 'uploaded_at']

    def get_patient(self, obj):
        return obj.patient.user.username
    get_patient.short_description = 'Patient'
    get_patient.admin_order_field = 'patient__user__username'


# Admin class for Specialization model
class SpecializationAdmin(admin.ModelAdmin):
    search_fields = ['name']
    list_display = ['id', 'name']


admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Physiotherapist, PhysioAdmin)
admin.site.register(Specialization)
admin.site.register(PhysiotherapistSpecialization)
admin.site.register(Pricing)
admin.site.register(EncryptedValues)
admin.site.register(Admin)
