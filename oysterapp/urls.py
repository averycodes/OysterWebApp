from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from rest_framework import routers

from oysterapp.oyster.views import OysterView
from oysterapp.oyster.serializers import current_user
from oysterapp.oyster.serializers import UserViewSet
from oysterapp.oyster.serializers import HistoryViewSet
from oysterapp.oyster.serializers import IncompleteTaskViewSet
from oysterapp.oyster.serializers import WishViewSet


router = routers.DefaultRouter()
router.register(r'user', UserViewSet, base_name='user')
router.register(r'tasks', IncompleteTaskViewSet, base_name='tasks')
router.register(r'history', HistoryViewSet, base_name='history')
router.register(r'wishes', WishViewSet, base_name='wish')

urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/profile/$', current_user),
    url(r'^api/v1/', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', OysterView.as_view())
]

urlpatterns += staticfiles_urlpatterns()
