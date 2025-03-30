from django.db import migrations

def create_plans(apps, schema_editor):
    Pricing = apps.get_model('users', 'Pricing')
    
    plans = [
        {
            'name': 'blue',
            'price': 17.99,
            'video_limit': 15
        },
        {
            'name': 'gold',
            'price': 24.99,
            'video_limit': 30
        }
    ]
    
    for plan_data in plans:
        Pricing.objects.get_or_create(**plan_data)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_plans),
    ]
