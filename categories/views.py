from django.shortcuts import render
from django.http import JsonResponse
from .models import Category
from django.views.decorators.csrf import csrf_exempt
import json


def get_categories_page(request):
    categories = Category.objects.all()

    context = {
        'categories': categories
    }

    for category in categories:
        name = category.image.name
        if 'images' in name:
            category.image.name = name[name.index('/'):]

    return render(request, 'categories.html', context=context)


# def show_edit_page(request):
#     return render(request, 'editCategories.html')


@csrf_exempt
def get_categories_by_type(request):
    result = {'items': []}

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        button = json.load(request)['button']

        for category in Category.objects.all():
            if category.type == button:
                result['items'].append({
                    'image_name': category.image.name,
                    'name': category.name,
                })

    return JsonResponse(result)


@csrf_exempt
def get_current_bar_button_state(request):
    pass

