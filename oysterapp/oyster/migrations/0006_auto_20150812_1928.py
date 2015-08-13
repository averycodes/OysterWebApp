# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0005_task_task_rule'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='large_amount',
            field=models.FloatField(default=10),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='mid_amount',
            field=models.FloatField(default=5),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='small_amount',
            field=models.FloatField(default=1),
        ),
    ]
