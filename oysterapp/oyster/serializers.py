from django.contrib.auth.models import User

from rest_framework import routers
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import detail_route
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from oysterapp.oyster.models import Task
from oysterapp.oyster.models import Wish
from oysterapp.oyster.models import create_wish_from_url
from oysterapp.oyster.models import BillableItem
from oysterapp.oyster.models import TaskRule

from amazonproduct import API


# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    bank = serializers.FloatField(source='userprofile.piggy_bank')
    small_amount = serializers.FloatField(source='userprofile.small_amount')
    mid_amount = serializers.FloatField(source='userprofile.mid_amount')
    large_amount = serializers.FloatField(source='userprofile.large_amount')

    class Meta:
        model = User
        fields = ('url', 'username', 'id', 'bank', 'small_amount',
                  'mid_amount', 'large_amount')
        depth = 1


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data)


class WishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish


class WishViewSet(viewsets.ModelViewSet):
    serializer_class = WishSerializer

    def get_queryset(self):
        return Wish.objects.filter(user=self.request.user, completed=False)

    def create(self, request, *args, **kwargs):
        data = request.DATA
        if data['amazon_link']:
            wish = create_wish_from_url(request.user, data['amazon_link'])
        else:
            wish = Wish(data)
            wish.save()

        serializer = WishSerializer(wish)
        return Response(serializer.data)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task


class BillableItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillableItem


class HistoryViewSet(viewsets.ModelViewSet):
    serializer_class = BillableItemSerializer

    def get_queryset(self):
        return BillableItem.objects.filter(user=self.request.user, completed=True).order_by('-updated')


class IncompleteTaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, completed=False).order_by('-created')

    def create(self, request, *args, **kwargs):
        data = request.DATA
        data['user'] = request.user
        task = Task.objects.create(**data)

        serialized_data = data
        serialized_data['user'] = request.user.id
        serialized_data['id'] = task.id
        serialized_data['created'] = task.created
        serialized_data['updated'] = task.updated

        return Response(serialized_data,
                        status=status.HTTP_201_CREATED)


class TaskRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskRule


class TaskRuleViewSet(viewsets.ModelViewSet):
    serializer_class = TaskRuleSerializer
    lookup_field = 'uuid'
    lookup_value_regex = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

    def get_queryset(self):
        return TaskRule.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.DATA
        task_rule = None
        if data.get('frequency') and data.get('scale'):
            task_rule = TaskRule.objects.create(
                user=request.user,
                amount=float(data['amount']),
                title=data['title'],
                frequency=data['frequency'],
                scale=data['scale'],
                uuid=data['uuid'],
                completable_by=data['completable_by']
            )
        task = Task.objects.create(
            user=request.user,
            amount=float(data['amount']),
            title=data['title'],
            task_rule=task_rule,
            doable=bool(data['completable_by'] == 'Oyster')
        )

        return Response(data, status=status.HTTP_201_CREATED)

    @detail_route(methods=['get'])
    def completed(self, request, uuid=None):
        task_rule = TaskRule.objects.get(uuid=uuid)
        task = task_rule.get_first_open_task()

        if task:
            task.completed = True
            task.save()

        return Response({}, status=status.HTTP_201_CREATED)
