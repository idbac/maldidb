# Generated by Django 3.1 on 2021-06-11 00:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spectra', '0007_auto_20210609_2238'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='binnedpeaks',
            name='peak_intensity',
        ),
        migrations.RemoveField(
            model_name='collapsedcosinescore',
            name='binned_peaks',
        ),
    ]
