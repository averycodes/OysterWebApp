# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0009_auto_20150819_1624'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='can_be_overdue',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='task',
            name='due_date',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
