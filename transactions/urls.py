from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.get_transactions_page),
    # path('edit', views.show_edit_page),
]
