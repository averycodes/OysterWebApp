from django.conf.urls import include, url
from django.contrib.auth import views as auth_views
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic.base import RedirectView

from rest_framework import routers

from oysterapp.oyster import views as oyster_views
from oysterapp.oyster.serializers import current_user
from oysterapp.oyster.serializers import UserViewSet
from oysterapp.oyster.serializers import HistoryViewSet
from oysterapp.oyster.serializers import IncompleteTaskViewSet
from oysterapp.oyster.serializers import WishViewSet
from oysterapp.oyster.serializers import TaskRuleViewSet


router = routers.DefaultRouter()
router.register(r'user', UserViewSet, base_name='user')
router.register(r'tasks', IncompleteTaskViewSet, base_name='tasks')
router.register(r'history', HistoryViewSet, base_name='history')
router.register(r'wishes', WishViewSet, base_name='wish')
router.register(r'rules', TaskRuleViewSet, base_name='rule')

urlpatterns = [
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/v1/profile/$', current_user),
    url(r'^api/v1/', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/profile/', RedirectView.as_view(url='/')),
    url(r'^accounts/login/', auth_views.login, {'template_name': 'registration/oyster_login.html'}),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^about/$', oyster_views.about),
    url(r'^$', oyster_views.app)
]

urlpatterns += staticfiles_urlpatterns()
