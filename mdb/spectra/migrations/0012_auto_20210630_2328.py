# Generated by Django 3.1 on 2021-06-30 23:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0014_auto_20210630_2316'),
        ('spectra', '0011_auto_20210630_2326'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='collapsedspectra',
            unique_together={('spectrum_mass_hash', 'library')},
        ),
        migrations.AlterUniqueTogether(
            name='searchspectra',
            unique_together={('spectrum_mass_hash', 'library')},
        ),
    ]