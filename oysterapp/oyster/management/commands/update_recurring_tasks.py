from datetime import datetime
from pytz import timezone

from django.core.management.base import BaseCommand

from oysterapp.oyster.models import TaskRule
from oysterapp.oyster.models import Task


class Command(BaseCommand):
    help = "Creates tasks based off task rules"

    def handle(self, *args, **options):
        now_utc = datetime.now(timezone('UTC'))

        print "###################################################"

        print "Now: %s" % now_utc.strftime("%D %H:%M %z")

        all_recurring_tasks = TaskRule.objects.all()
        recurring_tasks = TaskRule.objects.filter(
            next_scheduled_run__lte=now_utc)

        print "Total rules: %s out of %s" % (recurring_tasks.count(),
                                             all_recurring_tasks.count())

        for task_rule in recurring_tasks:
            tasks = Task.objects.filter(completed=False, task_rule=task_rule)
            if not tasks.count():
                task_rule.create_new_task()
                run = task_rule.calculate_next_run()
                print "task created next run: %s" % run.strftime("%D %H:%M %z")
            else:
                run = task_rule.calculate_next_run()
                print "a task already exists, no task created"

        print "###################################################"
