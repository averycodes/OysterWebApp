import re
import os
import uuid

from datetime import datetime, timedelta
from pytz import timezone

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.db.models import Sum

from amazonproduct import API


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    piggy_bank = models.FloatField(default=0)
    small_amount = models.FloatField(default=1)
    mid_amount = models.FloatField(default=5)
    large_amount = models.FloatField(default=10)
    last_seen = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return "%s's profile" % self.user


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)


class BillableItem(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    completed = models.BooleanField(default=False)
    amount = models.FloatField()
    is_credit = models.BooleanField(default=False)


class Task(BillableItem):
    doable = models.BooleanField(default=True)
    task_rule = models.ForeignKey('TaskRule', null=True)
    due_date = models.DateTimeField(null=True, blank=True)
    can_be_overdue = models.BooleanField(default=False)

    def __unicode__(self):
        completed = "Incomplete"
        if self.completed:
            completed = "Complete"
        return "[%s] %s (%s)" % (self.user, self.title, completed)


class Wish(BillableItem):
    amazon_link = models.CharField(max_length=255, null=True, blank=True)
    asin = models.CharField(max_length=255, null=True, blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    featured = models.BooleanField(default=False)
    url = models.CharField(max_length=255, null=True, blank=True)


def create_wish_from_url(user, url):
    AWS_KEY = os.environ['AWS_KEY']
    AWS_SECRET_KEY = os.environ['AWS_SECRET_KEY']
    ASSOCIATE_TAG = os.environ['ASSOCIATE_TAG']
    ASIN_MATCH = 'http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})'

    asin = list(re.match(ASIN_MATCH, url).groups())[-1]

    api = API(locale='us',
              associate_tag=ASSOCIATE_TAG,
              access_key_id=AWS_KEY,
              secret_access_key=AWS_SECRET_KEY)
    result = api.item_lookup(asin, ResponseGroup='ItemAttributes, OfferFull, Images')
    item = result.Items.Item[0]

    title = item.ItemAttributes.Title
    url = item.DetailPageURL

    if item.OfferSummary:
        amount = (item.OfferSummary.LowestNewPrice.Amount / 100)
    elif item.ItemAttributes.ListPrice:
        amount = (item.ItemAttributes.ListPrice.Amount / 100)
    else:
        amount = 0.0

    image_url = item.LargeImage.URL

    wish = Wish(
        user=user,
        asin=asin,
        title=title,
        amount=amount,
        is_credit=False,
        url=url,
        image_url=image_url
    )
    wish.save()

    return wish


FREQUENCY_CHOICES = (
    ('day', 'day'),
    ('week', 'week'),
    ('month', 'month'),
    ('year', 'year')
)

COMPLETABLE_BY = (
    ('Oyster', 'Oyster'),
    ('IFTTT', 'IFTTT')
)


class TaskRule(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    uuid = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    amount = models.FloatField(null=True)
    start = models.DateTimeField(auto_now_add=True)
    frequency = models.IntegerField(null=True)
    scale = models.CharField(max_length=30, choices=FREQUENCY_CHOICES,
                             null=True, blank=True)
    completable_by = models.CharField(max_length=30, choices=COMPLETABLE_BY,
                                      default='Oyster')
    next_scheduled_run = models.DateTimeField(auto_now_add=True)
    must_be_completed_by_time = models.TimeField(null=True)
    must_be_completed_in_x_days = models.IntegerField(null=True)
    regenerate_on_completion = models.BooleanField(default=False)
    can_be_overdue = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)

    def calculate_next_run(self):
        if self.scale == 'day':
            hours = 24
        elif self.scale == 'week':
            hours = 168
        elif self.scale == 'month':
            hours = 720
        elif self.scale == 'year':
            hours = 8760
        else:
            return
        delta = timedelta(hours=(hours / self.frequency))
        next_run = self.next_scheduled_run + delta
        self.next_scheduled_run = next_run
        self.save()

        return self.next_scheduled_run

    def infer_due_date(self):
        time = self.must_be_completed_by_time
        days = self.must_be_completed_in_x_days

        if not time and not days:
            return None

        now_utc = datetime.now(timezone('UTC'))
        now_pacific = now_utc.astimezone(timezone('US/Pacific'))

        due_date = now_pacific

        if time:
            due_date = due_date.replace(hour=time.hour, minute=time.minute)
            if due_date < now_pacific and not days:
                delta = timedelta(days=1)
                due_date = due_date + delta

        if days:
            delta = timedelta(days=days)
            due_date = due_date + delta

        return due_date

    def create_new_task(self):
        if self.cancelled:
            return
        doable = True
        if self.completable_by != 'Oyster':
            doable = False
        new_task = Task(
            user=self.user,
            title=self.title,
            amount=self.amount,
            task_rule=self,
            doable=doable,
            due_date=self.infer_due_date(),
            can_be_overdue=self.can_be_overdue,
            is_credit=True
        )
        new_task.save()
        return new_task

    def get_open_tasks(self):
        return Task.objects.filter(task_rule=self, completed=False).order_by('-created')

    def get_first_open_task(self):
        open_tasks = self.get_open_tasks()
        if open_tasks:
            return open_tasks.first()
        return None


def update_piggy_bank(sender, instance, created, **kwargs):
    profile = instance.user.userprofile
    credits = Task.objects.filter(user=instance.user,
                                  completed=True).aggregate(
                                  amount=Sum('amount'))
    deductions = Wish.objects.filter(user=instance.user,
                                     completed=True).aggregate(
                                     amount=Sum('amount'))
    amount = 0
    if credits.get('amount', 0):
        amount = credits.get('amount', 0)
    if deductions.get('amount', 0):
        amount -= deductions.get('amount', 0)
    profile.piggy_bank = amount
    profile.save()


def complete_task(sender, instance, created, **kwargs):
    if instance.completed and instance.task_rule and instance.task_rule.regenerate_on_completion:
        instance.task_rule.create_new_task()

post_save.connect(update_piggy_bank, sender=Task)
post_save.connect(complete_task, sender=Task)
post_save.connect(update_piggy_bank, sender=Wish)
