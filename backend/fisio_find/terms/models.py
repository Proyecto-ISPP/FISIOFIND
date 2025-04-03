from django.db import models
from users.models import Admin


class Terms(models.Model):
    TAG_CHOICES = [
        ('terms', 'Terms of Use'),
        ('cookies', 'Cookie Policy'),
        ('privacy', 'Privacy Policy'),
        ('license', 'License'),
    ]

    modifier = models.ForeignKey(Admin, on_delete=models.PROTECT)
    content = models.TextField(help_text="Markdown content for the terms")
    version = models.CharField(max_length=100)
    tag = models.CharField(max_length=20, choices=TAG_CHOICES, default='terms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_tag_display()} - {self.version}"

    class Meta:
        verbose_name = "Term"
        verbose_name_plural = "Terms"
