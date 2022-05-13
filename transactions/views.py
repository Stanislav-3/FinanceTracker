from django.shortcuts import render
from django.shortcuts import HttpResponse


def show_transactions_page(request):
    return render(request, 'transactions.html')
    # return HttpResponse('transactions.html')



def show_edit_page(request):
    return render(request, 'editTransaction.html')