from django.contrib import admin
from django.urls import path

from tracker import views

urlpatterns = [
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
