# Generated by Django 2.2.13 on 2020-10-22 16:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0028_collapsedspectra'),
    ]

    operations = [
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='spectra',
            new_name='collapsed_spectra',
        ),
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='lowerMassCutoff',
            new_name='lower_mass_cutoff',
        ),
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='minSNR',
            new_name='min_SNR',
        ),
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='peakPercentPresence',
            new_name='peak_percent_presence',
        ),
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='spectraContent',
            new_name='spectra_content',
        ),
        migrations.RenameField(
            model_name='collapsedspectra',
            old_name='upperMassCutoff',
            new_name='upper_mass_cutoff',
        ),
    ]