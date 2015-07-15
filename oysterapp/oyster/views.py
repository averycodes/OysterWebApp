from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.generic.base import TemplateView
from django.shortcuts import render


@login_required
def app(request):
    return render(request, "index.html", {})


def logout_view(request):
    logout(request)
    # Redirect to a success page.
