# Generated by Django 3.1 on 2021-07-05 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ncbitaxonomy', '0010_txnode_parent'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='txnode',
            name='parent',
        ),
        migrations.AddField(
            model_name='txnode',
            name='cClass',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cFamily',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cGenus',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cKingdom',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cOrder',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cPhylum',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cSpecies',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='txnode',
            name='cSubspecies',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
