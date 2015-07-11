from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework import routers

from app.views import OysterView
from app.serializers import current_user
from app.serializers import UserViewSet
from app.serializers import CompleteTaskViewSet
from app.serializers import IncompleteTaskViewSet
from app.serializers import WishViewSet


router = routers.DefaultRouter()
router.register(r'user', UserViewSet, base_name='user')
router.register(r'tasks', IncompleteTaskViewSet, base_name='tasks')
router.register(r'history', CompleteTaskViewSet, base_name='history')
router.register(r'wishes', WishViewSet, base_name='wish')

urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/profile/$', current_user),
    url(r'^api/v1/', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', OysterView.as_view())
]

urlpatterns += staticfiles_urlpatterns()
