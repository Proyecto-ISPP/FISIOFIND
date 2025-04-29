from django.db import models


class Rating(models.Model):
    physiotherapist = models.ForeignKey(
        'users.Physiotherapist', on_delete=models.CASCADE, related_name='ratings', verbose_name='Fisioterapeuta'
    )
    punctuation = models.IntegerField(choices=[(i, i) for i in range(1, 6)],verbose_name='Puntuación')
    opinion = models.TextField(blank=True, null=True, max_length=140, verbose_name='Opinión')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')

    class Meta:
        unique_together = ('physiotherapist',)

    def __str__(self):
        return f"Valoración {self.punctuation} de {self.physiotherapist.user.username}"
    
    class Meta:
        verbose_name = "Valoración"
        verbose_name_plural = "Valoraciones"