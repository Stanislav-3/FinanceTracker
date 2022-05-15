from django.shortcuts import render
from django.http import JsonResponse
from .models import Category
from django.views.decorators.csrf import csrf_exempt
import json
from binascii import a2b_base64
from django.core.files.images import ImageFile
import os


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


def get_edit_page(request):
    return render(request, 'editCategories.html')


@csrf_exempt
def get_categories_by_type(request):
    result = {'items': []}

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        button = json.load(request)['buttonName']

        for category in Category.objects.all():
            if category.type == button:
                result['items'].append({
                    'image_name': category.image.name,
                    'name': category.name,
                })

    return JsonResponse(result)


@csrf_exempt
def delete_category(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        name = json.load(request)['name']

        Category.objects.filter(name=name).delete()

    return JsonResponse({})


@csrf_exempt
def save_edit(request):
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        props = json.load(request)
        prevName = props['prevItemName']
        name = props['name']
        image = props['image'].split('base64,')[1]
        type_ = props['type']

        img_path = f'{name}.jpg'

        with open(img_path, 'wb') as file:
            file.write(a2b_base64(image))

        print('prevName', prevName)
        category = Category.objects.filter(name=prevName)
        if category.count() == 0:
            print('new')
            Category.objects.create(name=name, image=ImageFile(open(img_path, 'rb')), type=type_)
        else:
            print('update')
            category.update(name=name, image=ImageFile(open(img_path, 'rb')), type=type_)

        os.remove(img_path)

    return JsonResponse({})


