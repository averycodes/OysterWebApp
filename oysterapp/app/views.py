from django.views.generic.base import TemplateView
from django.shortcuts import render


# Create your views here.
class OysterView(TemplateView):
    template_name = "index.html"
