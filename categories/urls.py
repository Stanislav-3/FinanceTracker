from django.contrib import admin
from django.urls import path, include
from . import views
from transactions import views as tviews

urlpatterns = [
    path('', views.get_categories_page),
    # path('edit', views.show_edit_page),
    path('get_categories_by_type', views.get_categories_by_type),
    path('delete_category', views.delete_category)
    # path('transactions', tviews.show_transactions_page)
]
