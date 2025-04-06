from django.db import models


class Rating(models.Model):
    physiotherapist = models.ForeignKey(
        'users.Physiotherapist', on_delete=models.CASCADE, related_name='ratings'
    )
    punctuation = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    opinion = models.TextField(blank=True, null=True, max_length=140)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('physiotherapist',)

    def __str__(self):
        return f"Rating {self.punctuation} by {self.physiotherapist.user.username}"