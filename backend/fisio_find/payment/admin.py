from django.contrib import admin
from .models import Payment


class PaymentsAdmin(admin.ModelAdmin):
    search_fields = [
        'appointment__patient__user__email','appointment__patient__user__username','appointment__patient__user__first_name','appointment__patient__user__last_name','appointment__patient__user__dni',
        'appointment__physiotherapist__user__email','appointment__physiotherapist__user__username','appointment__physiotherapist__user__first_name','appointment__physiotherapist__user__last_name','appointment__physiotherapist__user__dni',
        'amount',
        ]
    list_filter = ['payment_method', 'status','payment_date']
    list_display = ['id','appointment__patient__user__username', 'appointment__physiotherapist__user__username', 'payment_method','status']


admin.site.register(Payment, PaymentsAdmin)