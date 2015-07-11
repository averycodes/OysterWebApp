# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 16, 413128, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='task',
            name='updated',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 22, 348855, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='taskrule',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 28, 36918, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='taskrule',
            name='updated',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 32, 68975, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='wish',
            name='created',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 35, 884936, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='wish',
            name='updated',
            field=models.DateTimeField(default=datetime.datetime(2015, 7, 10, 21, 19, 42, 636818, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
