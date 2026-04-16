from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView
from .views import verify_code, resend_code
from .views import CreateOrderView
from .views import MyOrdersView
from .views import contato_empresarial
from .views import UserDataView
from .views import RegisterPrestadorView
from .views import login_prestador
from .views import AvailableOrdersView
from .views import accept_order
from .views import my_jobs
from .views import perfil_prestador
from .views import iniciar_servico, encerrar_servico
from .views import criar_avaliacao, avaliacoes_do_prestador
from .views import minhas_avaliacoes_recebidas, status_avaliacao_order
from .views import avaliacoes_recebidas_order
from .views import carteira_resumo, carteira_extrato, solicitar_saque
from .views import PasswordResetRequestView, PasswordResetConfirmView
from .views import listar_prestadores



urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path("verify-code/", verify_code),
    path("resend-code/", resend_code),
    path('orders/create/', CreateOrderView.as_view()),
    path('orders/my/', MyOrdersView.as_view()),
    path("contato-empresarial/", contato_empresarial),
    path('user/data/', UserDataView.as_view()),
    path('prestador/register/', RegisterPrestadorView.as_view()),
    path('prestador/login/', login_prestador),
    path('orders/available/', AvailableOrdersView.as_view()),
    path('orders/<int:pk>/accept/', accept_order),
    path('orders/my-jobs/', my_jobs),
    path('prestador/me/', perfil_prestador),
    path('orders/<int:pk>/iniciar/', iniciar_servico),
    path('orders/<int:pk>/encerrar/', encerrar_servico),
    path('avaliacoes/criar/', criar_avaliacao),
    path('avaliacoes/prestador/<int:prestador_id>/', avaliacoes_do_prestador),
    path('avaliacoes/minhas/', minhas_avaliacoes_recebidas),
    path('orders/<int:pk>/status-avaliacao/', status_avaliacao_order),
    path('avaliacoes/order/<int:pk>/recebidas/', avaliacoes_recebidas_order),
    path('carteira/',         carteira_resumo),
    path('carteira/extrato/', carteira_extrato),
    path('carteira/sacar/',   solicitar_saque),
    path("password-reset/", PasswordResetRequestView.as_view()),
    path("password-reset-confirm/", PasswordResetConfirmView.as_view()),
    path('prestadores/', listar_prestadores),
]

