from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
from .helpers import interview_model, questions_from_text, questions_from_topic, rewrite_all
import json

def questions_from(request):
    result = "Failed"
    details = request.POST
    print(details)
    try:
        if "topic" in details:
            result = questions_from_topic(details["topic"])
        elif "text" in details:
            result = questions_from_text(details["text"])
        else:
            result = "Passed"
    except Exception as error:
        with open("../../../errors.txt", 'a') as file:
            file.write(f"{str(error)}\n")
    return HttpResponse(json.dumps(result))

def questions_rewrite(request):
    result = ""
    details = request.POST
    return HttpResponse("Not implemented")