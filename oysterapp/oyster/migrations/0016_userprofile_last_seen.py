# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0015_remove_wish_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='last_seen',
            field=models.DateTimeField(default=datetime.datetime(2015, 10, 2, 21, 49, 46, 501661, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
