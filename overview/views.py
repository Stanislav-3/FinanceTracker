from django.shortcuts import render


def show_overview_page(request):
    return render(request, 'overview.html')
