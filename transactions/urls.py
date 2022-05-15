from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.get_transactions_page),
    # path('edit', views.show_edit_page),
    path('get_transactions_by_type', views.get_transactions_by_type),
    path('delete_transaction', views.delete_transaction)
]
