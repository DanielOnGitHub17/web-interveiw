from django.shortcuts import render
from django.views import View

# Create your views here.
class Saved(View):
    def get(self, request):
        return ""
    
    def post(self, request):
        context = {}
        return render(request, "index.html", context)