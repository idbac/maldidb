# Generated by Django 3.1 on 2021-07-08 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docspage',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]