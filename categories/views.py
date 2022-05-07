from django.shortcuts import render


def show_categories_page(request):
    return render(request, 'categories.html')


def show_edit_page(request):
    return render(request, 'editCategories.html')