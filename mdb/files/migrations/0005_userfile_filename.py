# Generated by Django 3.1 on 2021-08-06 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0004_auto_20210803_1904'),
    ]

    operations = [
        migrations.AddField(
            model_name='userfile',
            name='filename',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
