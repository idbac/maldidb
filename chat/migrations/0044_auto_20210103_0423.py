# Generated by Django 2.2.13 on 2021-01-03 04:23

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0043_labgroup_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='labgroup',
            name='owner',
        ),
        migrations.AddField(
            model_name='labgroup',
            name='owners',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]