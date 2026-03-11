from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from .models import EmailVerification
from .utils import send_verification_email
from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings



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

class CreateOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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