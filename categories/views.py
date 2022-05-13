from django.shortcuts import render
from django.http import JsonResponse
from .models import Category


def show_categories_page(request):
    categories = Category.objects.all()

    context = {
        'categories': categories
    }

    for category in categories:
        name = category.image.name
        if 'images' in name:
            category.image.name = name[name.index('/'):]

    return render(request, 'categories.html', context=context)


def show_edit_page(request):
    return render(request, 'editCategories.html')