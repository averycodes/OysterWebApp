# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BillableItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255, null=True, blank=True)),
                ('completed', models.BooleanField(default=False)),
                ('amount', models.FloatField()),
                ('is_credit', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='TaskRule',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=255, null=True, blank=True)),
                ('start', models.DateTimeField(auto_now_add=True)),
                ('schedule', models.CharField(max_length=255, null=True, blank=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('piggy_bank', models.FloatField(default=0)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('billableitem_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='oyster.BillableItem')),
                ('doable', models.BooleanField(default=True)),
            ],
            bases=('oyster.billableitem',),
        ),
        migrations.CreateModel(
            name='Wish',
            fields=[
                ('billableitem_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='oyster.BillableItem')),
                ('amazon_link', models.CharField(max_length=255, null=True, blank=True)),
                ('image', models.ImageField(null=True, upload_to=b'')),
            ],
            bases=('oyster.billableitem',),
        ),
        migrations.AddField(
            model_name='billableitem',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
    ]
