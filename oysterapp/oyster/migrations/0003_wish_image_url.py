# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0002_auto_20150712_0045'),
    ]

    operations = [
        migrations.AddField(
            model_name='wish',
            name='image_url',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
