from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.get_transactions_page),
    path('edit', views.get_edit_page),
    path('edit/get_select_options', views.get_select_options),
    path('edit/get_inputs_data', views.get_inputs_data),
    path('get_transactions_by_type', views.get_transactions_by_type),
    path('delete_transaction', views.delete_transaction)
]
