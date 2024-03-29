# Generated by Django 3.1 on 2021-08-16 00:48

import django.core.validators
from django.db import migrations, models
import files.models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0008_auto_20210816_0036'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userfile',
            name='file',
            field=models.FileField(storage=files.models.OverwriteStorage(), upload_to='uploads/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['mzml', 'mzxml', 'fid', 'csv'])]),
        ),
    ]
