# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0017_auto_20151007_2336'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wish',
            name='featured',
        ),
        migrations.AddField(
            model_name='billableitem',
            name='featured',
            field=models.BooleanField(default=False),
        ),
    ]
