from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin 
from .models import AppUser, Patient, Physiotherapist, Admin
from .forms import AppUserCreationForm, AppUserChangeForm

class AppUserAdmin(BaseUserAdmin): 
    add_form = AppUserCreationForm
    form = AppUserChangeForm
    model = AppUser

    list_display = ['id','username', 'first_name', 'email', 'dni', 'account_status']

    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {
            'fields': ('photo', 'dni', 'phone_number', 'postal_code', 'account_status'),
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'photo', 'dni', 'phone_number', 'postal_code', 'account_status',
            ),
        }),
    )
    
    search_fields = ('username', 'first_name', 'last_name', 'email', 'dni', 'account_status')
    list_filter = ('account_status', 'is_staff', 'is_active', 'groups')

class PatientAdmin(admin.ModelAdmin):
    search_fields = ['user__email','user__username','user__first_name','user__last_name','user__dni', 'gender']
    list_filter = ['gender']
    list_display = ['id','user__username', 'user__first_name','user__last_name','user__email']

class PhysioAdmin(admin.ModelAdmin):
    search_fields = ['user__email','user__username','user__first_name','user__last_name','user__dni', 'gender',
                     'autonomic_community', 'collegiate_number']
    list_filter = ['gender', 'autonomic_community']
    list_display = ['id','user__username', 'user__email', 'collegiate_number', 'autonomic_community']

admin.site.register(AppUser, AppUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Physiotherapist, PhysioAdmin)
admin.site.register(Admin)
