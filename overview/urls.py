from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.get_overview_page),
    path('get_fake_data', views.get_fake_data)
]
