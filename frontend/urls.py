from django.urls import path

from . import views

urlpatterns = [
    path("", views.app_view, name="Front-End View"),
    path("<int:saved>/", views.Saved.as_view(), name="Front-End View"),
]
