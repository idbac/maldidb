# Generated by Django 2.2.13 on 2020-10-01 21:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0011_auto_20201001_2136'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='md',
        ),
    ]