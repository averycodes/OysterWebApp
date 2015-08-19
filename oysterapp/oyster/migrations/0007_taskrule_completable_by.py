# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0006_auto_20150812_1928'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskrule',
            name='completable_by',
            field=models.CharField(default=b'Oyster', max_length=30, choices=[(b'Oyster', b'Oyster'), (b'IFTTT', b'IFTTT')]),
        ),
    ]
