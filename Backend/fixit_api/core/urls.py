from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView
from .views import verify_code, resend_code
from .views import CreateOrderView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path("verify-code/", verify_code),
    path("resend-code/", resend_code),
    path('orders/create/', CreateOrderView.as_view()),
]

