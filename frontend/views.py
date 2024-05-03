from django.shortcuts import render
from django.http import HttpResponse, Http404
from django.views import View
from .models import Interview


interview_parameters = ("")

def app_view(request):
    return render(request, "index.html", {})


class Saved(View):
    def get(self, request):
        return ""
    
    def post(self, request):
        context = {}
        return render(request, "index.html", context)