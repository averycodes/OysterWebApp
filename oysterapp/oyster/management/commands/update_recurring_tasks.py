import datetime
import pytz

from django.core.management.base import BaseCommand

from oysterapp.oyster.models import TaskRule


class Command(BaseCommand):
    help = "Creates tasks based off task rules"

    def handle(self, *args, **options):
        now = datetime.datetime.now().replace(tzinfo=pytz.UTC)
        last_run = TaskRule.objects.order_by('-updated').first().updated

        print "###################################################"

        print "Now: %s" % now.strftime("%h %D %H:%M %z")
        print "Last Run: %s" % last_run.strftime("%h %D %H:%M %z")

        all_recurring_tasks = TaskRule.objects.all()
        recurring_tasks = TaskRule.objects.filter(next_scheduled_run__gt=last_run,
                                                  next_scheduled_run__lte=now)

        print "Total rules: %s out of %s" % (recurring_tasks.count(), all_recurring_tasks.count())

        for task_rule in recurring_tasks:
            print "updating rule: %s" % task_rule.title
            task_rule.create_new_task()
            run = task_rule.calculate_next_run()
            print "next run: %s" % run.strftime("%h %D %H:%M %z")

        print "###################################################"

