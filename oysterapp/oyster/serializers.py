from django.contrib.auth.models import User

from rest_framework import routers
from rest_framework import serializers
from rest_framework import viewsets
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from oysterapp.oyster.models import Task
from oysterapp.oyster.models import Wish
from oysterapp.oyster.models import create_wish_from_url
from oysterapp.oyster.models import BillableItem

from amazonproduct import API


# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    bank = serializers.FloatField(source='userprofile.piggy_bank')

    class Meta:
        model = User
        fields = ('url', 'username', 'id', 'bank')
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
        wish = create_wish_from_url(request.user, data['amazon_link'])

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
