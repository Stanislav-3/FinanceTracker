from django.shortcuts import render
from django.http import JsonResponse
from categories.models import Category
import random


def get_overview_page(request):
    return render(request, 'overview.html')


def get_fake_data(request):
    data = {'items': []}
    expenses_categories, income_categories = [], []

    for obj in Category.objects.all().filter(type='Expenses'):
        expenses_categories.append(obj.name)

    for obj in Category.objects.all().filter(type='Income'):
        income_categories.append(obj.name)

    for i in range(1, 30):
        item1 = {
            'type': 'Expenses',
            'amount': -random.random() * 70,
            'category': random.choice(expenses_categories),
            'date': f'{i}'
        }
        item2 = {
            'type': 'Income',
            'amount': random.random() * 100,
            'category': random.choice(income_categories),
            'date': f'{i}'
        }

        data['items'].append(item1)
        data['items'].append(item2)

    return JsonResponse(data)
