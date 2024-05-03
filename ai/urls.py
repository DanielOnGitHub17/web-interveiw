from django.urls import path

from . import views

urlpatterns = [
    path("questions/", views.questions_from, name="AI question gen"),
    path("rewrite/", views.questions_rewrite, name="AI Rewrite"),
]
