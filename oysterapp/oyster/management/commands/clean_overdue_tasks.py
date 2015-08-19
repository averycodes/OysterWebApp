from datetime import datetime
from pytz import timezone

from django.core.management.base import BaseCommand

from oysterapp.oyster.models import Task


class Command(BaseCommand):
    help = "Deletes any overdue tasks which can't be overdue"

    def handle(self, *args, **options):
        now_utc = datetime.now(timezone('UTC'))

        overdue = Task.objects.filter(due_date__lte=now_utc,
                                      completed=False,
                                      can_be_overdue=False)
        overdue.delete()
