# Generated by Django 3.1 on 2021-05-05 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spectra', '0002_collapsedcosinescore_searchspectracosinescore_spectracosinescore'),
    ]

    operations = [
        migrations.AddField(
            model_name='collapsedspectra',
            name='max_mass',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='collapsedspectra',
            name='min_mass',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
