# Generated by Django 3.1 on 2021-06-15 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0010_auto_20210517_2222'),
    ]

    operations = [
        migrations.AddField(
            model_name='labgroup',
            name='user_default_lab',
            field=models.BooleanField(blank=True, default=False),
        ),
    ]
