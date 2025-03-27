from django.contrib import admin
from appointment.models import Appointment

class AppointmentAdmin(admin.ModelAdmin):
    search_fields = [
        'patient__user__email','patient__user__username','patient__user__first_name','patient__user__last_name','patient__user__dni',
        'physiotherapist__user__email','physiotherapist__user__username','physiotherapist__user__first_name','physiotherapist__user__last_name','physiotherapist__user__dni',
        ]
    list_filter = ['is_online', 'start_time','end_time', 'status']
    list_display = ['id','patient__user__username', 'physiotherapist__user__username','is_online', 'start_time','end_time']


# Register your models here.
admin.site.register(Appointment, AppointmentAdmin)