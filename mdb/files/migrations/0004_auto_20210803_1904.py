# Generated by Django 3.1 on 2021-08-03 19:04

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0003_auto_20210523_0047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfile',
            name='file',
            field=models.FileField(upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['mzml', 'mzxml', 'fid', 'csv'])]),
        ),
    ]