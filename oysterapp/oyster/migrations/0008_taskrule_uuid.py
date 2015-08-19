# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid


def add_uuid(apps, schema_editor):
    TaskRule = apps.get_model("oyster", "TaskRule")
    for tr in TaskRule.objects.all():
        tr.uuid = uuid.uuid4()
        tr.save()


class Migration(migrations.Migration):

    dependencies = [
        ('oyster', '0007_taskrule_completable_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskrule',
            name='uuid',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.RunPython(add_uuid)
    ]
