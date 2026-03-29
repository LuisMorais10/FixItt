from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from .models import EmailVerification
from .utils import send_verification_email, send_order_confirmation_email
from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from .models import Prestador
from .serializers import PrestadorSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .utils import send_order_accepted_email


class AvailableOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(status='pending').order_by('-created_at')

 
class UserDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from .serializers import UserDataSerializer
        serializer = UserDataSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        from .serializers import UserUpdateSerializer
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Dados atualizados com sucesso"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Desativa até verificar
            user.is_active = False
            user.save()

            # Envia email com código
            send_verification_email(user)

            return Response(
                {"message": "Usuário criado com sucesso"},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def verify_code(request):
    email = request.data.get("email")
    code = request.data.get("code")

    try:
        user = User.objects.get(email=email)
        verification = EmailVerification.objects.get(user=user)

        if verification.is_expired():
            return Response({"error": "Código expirado"}, status=400)

        if verification.code != code:
            return Response({"error": "Código inválido"}, status=400)

        user.is_active = True
        user.save()

        verification.delete()

        return Response({"message": "Conta verificada com sucesso"})

    except Exception:
        return Response({"error": "Erro na verificação"}, status=400)


@api_view(["POST"])
def resend_code(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
        send_verification_email(user)

        return Response({"message": "Código reenviado com sucesso"})

    except User.DoesNotExist:
        return Response({"error": "Usuário não encontrado"}, status=400)


@api_view(["POST"])
def contato_empresarial(request):

    if not request.user.is_authenticated:
        return Response({"error": "Usuário não autenticado"}, status=401)

    mensagem = request.data.get("mensagem")

    if not mensagem:
        return Response({"error": "Mensagem é obrigatória"}, status=400)

    try:
        send_mail(
            subject="Recebemos sua mensagem",
            message=f"""
Olá {request.user.username},

Recebemos sua mensagem:

{mensagem}

Nossa equipe responderá em breve.

Equipe
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[request.user.email],
            fail_silently=False,
        )

        return Response({"success": True})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    



class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        send_order_confirmation_email(self.request.user, order)


class RegisterPrestadorView(generics.CreateAPIView):
    from .models import Prestador
    from .serializers import PrestadorSerializer
    queryset = Prestador.objects.all()
    serializer_class = PrestadorSerializer
    permission_classes = []

@api_view(['POST'])
def login_prestador(request):
    telefone = request.data.get('telefone')
    password = request.data.get('password')

    try:
        prestador = Prestador.objects.get(telefone=telefone)
    except Prestador.DoesNotExist:
        return Response({'error': 'Telefone ou senha incorretos'}, status=400)

    user = authenticate(username=prestador.user.username, password=password)

    if not user:
        return Response({'error': 'Telefone ou senha incorretos'}, status=400)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'email': user.email,
        'nome': prestador.nome,
    })

@api_view(['POST'])
def accept_order(request, pk):
    if not request.user.is_authenticated:
        return Response({"error": "Não autenticado"}, status=401)

    try:
        order = Order.objects.get(pk=pk)

        # ✅ Verifica se ainda está disponível
        if order.status != 'pending':
            return Response({'error': 'Pedido não disponível'}, status=400)

        # ✅ Pega o prestador logado
        prestador = Prestador.objects.get(user=request.user)

        # ✅ Atualiza pedido
        order.status = 'confirmed'  # 🔥 PADRONIZADO
        order.prestador = prestador
        order.save()

        send_order_accepted_email(order.user, order, prestador)

        return Response({'message': 'Pedido aceito com sucesso'})

    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)

    except Prestador.DoesNotExist:
        return Response({"error": "Usuário não é um prestador"}, status=403)

@api_view(['GET'])
def my_jobs(request):
    prestador = Prestador.objects.get(user=request.user)
    orders = Order.objects.filter(prestador=prestador)

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)