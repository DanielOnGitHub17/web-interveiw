from django.http import HttpResponse, Http404, HttpRequest
from django.shortcuts import render, redirect
from django.views import View
import json

from .models import Interview
from .forms import InterviewForm
from helpers import handle_error, message_home

# Create your views here.
class Saved(View):
    def get(self, request, at):
        try:
            interview = Interview.objects.get(pk=at)
            request.SHARED = {
                "QUESTIONS": json.loads(interview.questions),
                "TEXT_AFTER": interview.text_after,
                "TEXT_BEFORE": interview.text_before,
            }
        except Exception as error:
            handle_error(error)
            return redirect('/')
        url = request.build_absolute_uri()
        return message_home(request, f"{url}")
    
    def post(self, request):
        try:
            interview = InterviewForm(request.POST)
            if interview.is_valid():
                saved = interview.save()
                return redirect(f"/share/{saved.pk}/")
            else:
                raise Exception(f"Not valid{interview}")
        except Exception as error:
            handle_error(error)
        return redirect("/")