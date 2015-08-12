import datetime

from django.core.management.base import BaseCommand

from oysterapp.oyster.models import TaskRule


class Command(BaseCommand):
    help = "Creates tasks based off task rules"

    def handle(self, *args, **options):
        now = datetime.datetime.now()
        last_run = TaskRule.objects.order_by('-updated').first().updated

        recurring_tasks = TaskRule.objects.filter(next_scheduled_run__gt=last_run,
                                                  next_scheduled_run__lte=now)

        for task_rule in recurring_tasks:
            task_rule.create_new_task()
            run = task_rule.calculate_next_run()
            print "updating rule: %s next run: %s" % (task_rule.title, run)
