from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from django.conf import settings

from tracker import views


def serve_login(request):
    with open(settings.BASE_DIR.parent / 'login.html') as f:
        return HttpResponse(f.read(), content_type='text/html')


def serve_app(request):
    with open(settings.BASE_DIR.parent / 'index.html') as f:
        return HttpResponse(f.read(), content_type='text/html')


urlpatterns = [
    path('', serve_login),
    path('app/', serve_app),
    path('admin/', admin.site.urls),

    # Auth
    path('api/register/', views.api_register),
    path('api/login/', views.api_login),
    path('api/logout/', views.api_logout),
    path('api/me/', views.api_me),
    path('api/password/reset/', views.api_reset_password),

    # Profile
    path('api/profile/', views.api_profile),

    # Data
    path('api/exercises/', views.api_exercises),
    path('api/gyms/', views.api_gyms),
    path('api/gyms/<int:gym_id>/', views.api_gym_detail),
    path('api/sessions/', views.api_sessions),
]
