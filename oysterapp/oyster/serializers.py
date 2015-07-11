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
        return self.request.user.wish_set.filter(purchased=False)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'doable', 'reward', 'completed')


class CompleteTaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return self.request.user.task_set.filter(completed=True).order_by('-updated')


class IncompleteTaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return self.request.user.task_set.filter(completed=False).order_by('-created')

    def create(self, request, *args, **kwargs):
        data = request.DATA
        data['user'] = request.user
        task = Task.objects.create(**data)

        serialized_data = data
        serialized_data['user'] = request.user.id
        serialized_data['id'] = task.id

        return Response(serialized_data,
                        status=status.HTTP_201_CREATED)
