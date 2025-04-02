from django.contrib import admin
from .models import Rating


class RatingAdmin(admin.ModelAdmin):
    search_fields = [
        'physiotherapist__user__email', 'physiotherapist__user__username',
        'physiotherapist__user__first_name', 'physiotherapist__user__last_name',
        'punctuation', 'opinion'
    ]
    list_filter = ['punctuation', 'date']
    list_display = ['id', 'get_physiotherapist_username', 'punctuation', 'date']

    def get_physiotherapist_username(self, obj):
        return obj.physiotherapist.user.username
    get_physiotherapist_username.short_description = 'Physiotherapist'
    get_physiotherapist_username.admin_order_field = 'physiotherapist__user__username'


admin.site.register(Rating, RatingAdmin)
