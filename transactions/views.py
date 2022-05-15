from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Transaction


def get_transactions_page(request):
    return render(request, 'transactions.html')
#
#
# def show_edit_page(request):
#     return render(request, 'editTransaction.html')


@csrf_exempt
def get_transactions_by_type(request):
    result = {'items': []}

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        button = json.load(request)['buttonName']

        for transaction in Transaction.objects.all():
            if transaction.type == button:
                result['items'].append({
                    'image_name': transaction.label.image.name,
                    'amount': transaction.amount,
                    'name': transaction.label.name,
                })
    print(result)
    return JsonResponse(result)


@csrf_exempt
def delete_transaction(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        props = json.load(request)
        name = props['name']
        amount = props['amount']

        for transaction in Transaction.objects.filter(amount=amount):
            if transaction.label.name == name:
                transaction.delete()

    return JsonResponse({})