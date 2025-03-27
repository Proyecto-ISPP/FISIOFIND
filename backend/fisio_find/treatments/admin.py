from django.contrib import admin
from .models import Exercise, ExerciseLog, ExerciseSession, Series, Session, SessionTestResponse, SessionTest, Treatment

@admin.register(Treatment)
class TreatmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_patient_name', 'get_physiotherapist_name', 'start_time', 'end_time', 'is_active')
    list_filter = ('is_active', 'start_time', 'end_time')
    search_fields = ('patient__user__username', 'patient__user__email', 
                     'physiotherapist__user__username', 'physiotherapist__user__email',
                     'homework')
    date_hierarchy = 'start_time'
    
    def get_patient_name(self, obj):
        return obj.patient.user.username
    
    def get_physiotherapist_name(self, obj):
        return obj.physiotherapist.user.username
    
    get_patient_name.short_description = 'Patient'
    get_physiotherapist_name.short_description = 'Physiotherapist'
    
admin.site.register(Session)
admin.site.register(Exercise)
admin.site.register(ExerciseSession)
admin.site.register(Series)
admin.site.register(ExerciseLog)
admin.site.register(SessionTest)
admin.site.register(SessionTestResponse)