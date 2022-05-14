from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import JsonResponse


def show_transactions_page(request):
    return render(request, 'transactions.html')
    # return HttpResponse('transactions.html')


def show_edit_page(request):
    return render(request, 'editTransaction.html')