# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0012_wish_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='wish',
            name='featured',
            field=models.BooleanField(default=False),
        ),
    ]
