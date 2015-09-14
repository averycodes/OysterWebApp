# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0014_wish_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wish',
            name='link',
        ),
    ]
