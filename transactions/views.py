from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import JsonResponse


def get_transactions_page(request):
    return render(request, 'transactions.html')
#
#
# def show_edit_page(request):
#     return render(request, 'editTransaction.html')