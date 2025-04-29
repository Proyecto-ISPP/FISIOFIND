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
    
class ExerciseAdmin(admin.ModelAdmin):
    search_fields = [
        'physiotherapist__user__email','physiotherapist__user__username','physiotherapist__user__first_name','physiotherapist__user__last_name','physiotherapist__user__dni',
        'title', 'description',
        ]
    list_filter = ['body_region', 'exercise_type']
    list_display = ['id','title', 'physiotherapist__user__username', 'body_region', 'exercise_type']

class SessionAdmin(admin.ModelAdmin):
    search_fields = [
        'treatment__physiotherapist__user__email','treatment__physiotherapist__user__username','treatment__physiotherapist__user__first_name','treatment__physiotherapist__user__last_name','treatment__physiotherapist__user__dni',
        'treatment__patient__user__email','treatment__patient__user__username','treatment__patient__user__first_name','treatment__patient__user__last_name','treatment__patient__user__dni',
        'name', 'day_of_week'
        ]
    list_display = ['id','name', 'treatment__physiotherapist__user__username', 'treatment__patient__user__username', 'day_of_week']


    
admin.site.register(Session, SessionAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(ExerciseSession)
admin.site.register(Series)
admin.site.register(ExerciseLog)
admin.site.register(SessionTest)
admin.site.register(SessionTestResponse)