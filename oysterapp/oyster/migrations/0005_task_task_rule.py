# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0004_auto_20150812_0057'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='task_rule',
            field=models.ForeignKey(to='oyster.TaskRule', null=True),
        ),
    ]
