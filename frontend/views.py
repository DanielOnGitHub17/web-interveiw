from django.shortcuts import render
from django.http import HttpResponse, Http404

def app_view(request):
    return render(request, "index.html", {})
