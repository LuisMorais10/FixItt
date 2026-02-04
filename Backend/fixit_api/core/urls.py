from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import register_user

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
]

