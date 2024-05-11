from django.http import HttpResponse, Http404
from django.shortcuts import render, redirect
from django.views import View
import json

from .models import Interview
from .forms import InterviewForm
from ai.helpers import handle_error

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
        try:
            interview = InterviewForm(request)
            print(interview)
            return HttpResponse("true")
            redirect(f"/share/{interview.pk}/")
        except Exception as error:
            handle_error(error)
        context = {}
        return HttpResponse("true")