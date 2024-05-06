from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.views import View

from .models import Interview

import json

# Create your views here.
class Saved(View):
    def get(self, request, at):
        try:
            interview = Interview.objects.get(pk=at)
        except Exception as error:
            print(error)
            return Http404
        return render(request, "index.html", {})
    
    def post(self, request):
        questions = request.body
        print(questions)
        context = {}
        return HttpResponse("true")