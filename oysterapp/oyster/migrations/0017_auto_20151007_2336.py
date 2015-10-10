# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0016_userprofile_last_seen'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='last_seen',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
