from django.shortcuts import render


def get_overview_page(request):
    return render(request, 'overview.html')
