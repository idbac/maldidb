# Generated by Django 3.1 on 2021-07-09 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0009_auto_20210709_0542'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docspage',
            name='slug',
            field=models.SlugField(blank=True, max_length=200, null=True, unique=True),
        ),
    ]