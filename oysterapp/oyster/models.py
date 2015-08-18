import re
import os
import datetime

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

    def __unicode__(self):
        completed = "Incomplete"
        if self.completed:
            completed = "Complete"
        return "[%s] %s (%s)" % (self.user, self.title, completed)


class Wish(BillableItem):
    amazon_link = models.CharField(max_length=255, null=True, blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    asin = models.CharField(max_length=255, null=True, blank=True)


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
    result = api.item_lookup(asin, ResponseGroup='ItemAttributes')

    item = result.Items.Item[0]

    wish = Wish(
        user=user,
        asin=asin,
        title=item.ItemAttributes.Title,
        amount=(item.ItemAttributes.ListPrice.Amount / 100.0),
        is_credit=False
    )
    wish.save()

    result = api.item_lookup(asin, ResponseGroup='Images')
    item = result.Items.Item[0]
    wish.image_url = item.LargeImage.URL
    wish.save()

    return wish


FREQUENCY_CHOICES = (
    ('day', 'day'),
    ('week', 'week'),
    ('month', 'month'),
    ('year', 'year')
)


class TaskRule(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    amount = models.FloatField(null=True)
    start = models.DateTimeField(auto_now_add=True)
    frequency = models.IntegerField(null=True)
    scale = models.CharField(max_length=30, choices=FREQUENCY_CHOICES,
                             null=True, blank=True)
    next_scheduled_run = models.DateTimeField(auto_now_add=True)

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
        delta = datetime.timedelta(hours=(hours / self.frequency))
        next_run = self.next_scheduled_run + delta
        self.next_scheduled_run = next_run
        self.save()

        return self.next_scheduled_run

    def create_new_task(self):
        new_task = Task(
            user=self.user,
            title=self.title,
            amount=self.amount,
            doable=True
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

post_save.connect(update_piggy_bank, sender=Task)
post_save.connect(update_piggy_bank, sender=Wish)
