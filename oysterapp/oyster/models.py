import re
import os

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.db.models import Sum

from amazonproduct import API


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    piggy_bank = models.FloatField(default=0)

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
    wish.image_url = item.MediumImage.URL
    wish.save()

    return wish


class TaskRule(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    start = models.DateTimeField(auto_now_add=True)
    schedule = models.CharField(max_length=255, null=True, blank=True)


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
