# Generated by Django 3.1 on 2021-08-16 00:36

import django.core.validators
from django.db import migrations, models
import files.models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0007_userfile_library'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfile',
            name='file',
            field=models.FileField(upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['mzml', 'mzxml', 'fid', 'csv'])]),
        ),
    ]
