# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0010_auto_20150819_1627'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskrule',
            name='regenerate_on_completion',
            field=models.BooleanField(default=False),
        ),
    ]
