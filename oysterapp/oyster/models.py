from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.db.models import Sum


class UserProfile(models.Model):
    user = models.OneToOneField(User)
    piggy_bank = models.FloatField(default=0)

    def __unicode__(self):
        return "%s's profile" % self.user


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)


class Task(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    doable = models.BooleanField(default=True)
    reward = models.FloatField()
    completed = models.BooleanField(default=False)

    def __unicode__(self):
        completed = "Incomplete"
        if self.completed:
            completed = "Complete"
        return "[%s] %s (%s)" % (self.user, self.title, completed)


class TaskRule(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    start = models.DateTimeField(auto_now_add=True)
    schedule = models.CharField(max_length=255, null=True, blank=True)


class Wish(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(null=True)
    cost = models.FloatField(default=0)
    purchased = models.BooleanField(default=False)


def update_piggy_bank(sender, instance, created, **kwargs):
    profile = instance.user.userprofile
    credits = Task.objects.filter(user=instance.user,
                                  completed=True).aggregate(
                                  amount=Sum('reward'))
    deductions = Wish.objects.filter(user=instance.user,
                                     purchased=True).aggregate(
                                     amount=Sum('cost'))
    amount = 0
    if credits.get('amount', 0):
        amount = credits.get('amount', 0)
    if deductions.get('amount', 0):
        amount -= deductions.get('amount', 0)
    profile.piggy_bank = amount
    profile.save()

post_save.connect(update_piggy_bank, sender=Task)
post_save.connect(update_piggy_bank, sender=Wish)
