# Generated by Django 3.1 on 2021-07-13 22:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('spectra', '0018_auto_20210712_2244'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='collapsedspectra',
            unique_together=set(),
        ),
        migrations.AlterUniqueTogether(
            name='searchspectra',
            unique_together=set(),
        ),
    ]
