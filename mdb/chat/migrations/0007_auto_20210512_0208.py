# Generated by Django 3.1 on 2021-05-12 02:08

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0006_auto_20210512_0038'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labgroup',
            name='members',
            field=models.ManyToManyField(blank=True, null=True, related_name='lab_members', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='labgroup',
            name='owners',
            field=models.ManyToManyField(blank=True, null=True, related_name='lab_owners', to=settings.AUTH_USER_MODEL),
        ),
    ]
