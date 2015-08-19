# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0008_taskrule_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskrule',
            name='can_be_overdue',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='taskrule',
            name='cancelled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='taskrule',
            name='must_be_completed_by_time',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='taskrule',
            name='must_be_completed_in_x_days',
            field=models.IntegerField(null=True),
        ),
    ]
