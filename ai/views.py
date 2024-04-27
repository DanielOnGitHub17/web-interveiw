from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
from .helpers import interview_model

def questions_from_topic(request):
    details = request.GET
    if "topic" in details:
        pass
    return HttpResponse("Not implemented")