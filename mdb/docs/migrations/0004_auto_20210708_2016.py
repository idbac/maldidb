# Generated by Django 3.1 on 2021-07-08 20:16

from django.db import migrations
import markdownx.models


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0003_auto_20210708_2001'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docspage',
            name='content',
            field=markdownx.models.MarkdownxField(),
        ),
    ]
