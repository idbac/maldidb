# Generated by Django 3.1 on 2021-08-04 15:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0020_library_user_files'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usertaskstatus',
            name='user_task',
        ),
        migrations.DeleteModel(
            name='UserTask',
        ),
        migrations.DeleteModel(
            name='UserTaskStatus',
        ),
    ]
