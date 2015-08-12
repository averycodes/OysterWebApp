# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0003_wish_image_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taskrule',
            name='schedule',
        ),
        migrations.AddField(
            model_name='taskrule',
            name='amount',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='taskrule',
            name='frequency',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='taskrule',
            name='next_scheduled_run',
            field=models.DateTimeField(default=datetime.datetime(2015, 8, 12, 0, 57, 4, 29104, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='taskrule',
            name='scale',
            field=models.CharField(blank=True, max_length=30, null=True, choices=[(b'day', b'day'), (b'week', b'week'), (b'month', b'month'), (b'year', b'year')]),
        ),
    ]
