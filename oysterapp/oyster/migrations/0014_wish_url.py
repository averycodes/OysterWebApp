# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0013_wish_featured'),
    ]

    operations = [
        migrations.AddField(
            model_name='wish',
            name='url',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
