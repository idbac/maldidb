# Generated by Django 3.1 on 2021-07-09 03:02

from django.db import migrations
import markdownx.models


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0007_auto_20210709_0133'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docspage',
            name='content',
            field=markdownx.models.MarkdownxField(blank=True, null=True),
        ),
    ]
