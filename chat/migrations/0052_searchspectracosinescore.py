# Generated by Django 2.2.13 on 2021-01-05 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0051_auto_20210105_1531'),
    ]

    operations = [
        migrations.CreateModel(
            name='SearchSpectraCosineScore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.DecimalField(decimal_places=6, max_digits=10)),
                ('spectra1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='search_spectra1', to='chat.SearchSpectra')),
                ('spectra2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='search_spectra2', to='chat.Spectra')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]