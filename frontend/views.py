from django.shortcuts import render

# Create your views here.

def app_view(request):
    return render(request, "index.html", {})

def saved_view(request, saved):
    if saved:
        context = {}
    return render(request, "index.html", context)