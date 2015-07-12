# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wish',
            name='image',
        ),
        migrations.AddField(
            model_name='wish',
            name='asin',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
