from django.shortcuts import render


def show_transactions_page(request):
    return render(request, 'transactions.html')


def show_edit_page(request):
    return render(request, 'editTransaction.html')