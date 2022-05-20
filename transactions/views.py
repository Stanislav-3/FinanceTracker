import datetime

from django.shortcuts import render
from django.shortcuts import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Transaction
from transactions.models import Category
from binascii import a2b_base64
from django.core.files.images import ImageFile
import os


def get_transactions_page(request):
    return render(request, 'transactions.html')


def get_edit_page(request):
    return render(request, 'editTransaction.html')


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


@csrf_exempt
def save_edit(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        props = json.load(request)

        prevAmount = props['prevAmount']
        prevLabel = props['prevLabel']
        amount = props['amount']
        label = props['label']
        type = props['type']
        year, month, day = map(int, props['date'].split('-'))
        information = props['information']
        print(props)

        if prevLabel is not None:
            categories = Category.objects.all().filter(name=prevLabel)
            transaction = Transaction.objects.filter(amount=prevAmount).filter(label=categories[0])
            transaction.update(amount=amount,
                               type=type,
                               information=information,
                               date=datetime.date(year, month, day),
                               label=Category.objects.filter(name=label)[0])
        else:
            Transaction.objects.create(amount=amount,
                                       type=type,
                                       information=information,
                                       date=datetime.date(year, month, day),
                                       label=Category.objects.filter(name=label)[0])

    return JsonResponse({})


@csrf_exempt
def get_select_options(request):
    if request.headers.get("X-Requested-With") != "XMLHttpRequest":
        return

    type_ = json.load(request)['type']
    result = {'items': []}

    for category in Category.objects.all():
        if category.type == type_:
            result['items'].append(category.name)

    return JsonResponse(result)


@csrf_exempt
def get_inputs_data(request):
    if request.headers.get("X-Requested-With") != "XMLHttpRequest":
        return

    props = json.load(request)
    print(props)
    amount = props['amount']
    category = props['category']

    categories = Category.objects.all().filter(name=category)
    obj = Transaction.objects.filter(label=categories[0]).filter(amount=amount)[0]
    result = {'date': obj.date, 'information': obj.information}

    return JsonResponse(result)