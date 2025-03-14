# Generated by Django 5.1.6 on 2025-03-13 17:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gestion_citas', '0001_initial'),
        ('gestion_usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='patient_appointments', to='gestion_usuarios.patient', verbose_name='Patient'),
        ),
        migrations.AddField(
            model_name='appointment',
            name='physiotherapist',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='physio_appointments', to='gestion_usuarios.physiotherapist', verbose_name='Physiotherapist'),
        ),
    ]
