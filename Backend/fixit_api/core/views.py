from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
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
from .models import CodigoEncerramento
from .utils import send_codigo_encerramento_email
from .utils import send_ticket_completed_email
from .models import Avaliacao
from .serializers import AvaliacaoSerializer, CriarAvaliacaoSerializer
from django.db.models import Avg
from django.db.models import Sum
from .models import SolicitacaoSaque
from .serializers import DadosBancariosSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.db.models import Avg, Count, Q


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
@permission_classes([IsAuthenticated])
def my_jobs(request):
    prestador = Prestador.objects.get(user=request.user)
    orders = Order.objects.filter(prestador=prestador)

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_prestador(request):
    try:
        prestador = Prestador.objects.get(user=request.user)
        serializer = PrestadorSerializer(prestador)
        total_servicos = Order.objects.filter(prestador=prestador).count()
        data = serializer.data
        data['total_servicos'] = total_servicos
        return Response(data)
    except Prestador.DoesNotExist:
        return Response({'error': 'Prestador não encontrado'}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def iniciar_servico(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        prestador = Prestador.objects.get(user=request.user)

        if order.prestador != prestador:
            return Response({'error': 'Sem permissão'}, status=403)

        if order.status != 'confirmed':
            return Response({'error': 'Pedido não está confirmado'}, status=400)

        # Gera o código
        codigo = CodigoEncerramento.generate_code()
        CodigoEncerramento.objects.update_or_create(
            order=order,
            defaults={'codigo': codigo}
        )

        # Muda status
        order.status = 'in_progress'
        order.save()

        # Envia email pro user com o código
        send_codigo_encerramento_email(order.user, order, codigo)

        return Response({'message': 'Serviço iniciado! Código enviado ao cliente.'})

    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def encerrar_servico(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        prestador = Prestador.objects.get(user=request.user)

        if order.prestador != prestador:
            return Response({'error': 'Sem permissão'}, status=403)

        if order.status != 'in_progress':
            return Response({'error': 'Serviço não está em andamento'}, status=400)

        codigo_informado = request.data.get('codigo')
        codigo_obj = CodigoEncerramento.objects.get(order=order)

        if codigo_obj.codigo != codigo_informado:
            return Response({'error': 'Código inválido'}, status=400)

        order.status = 'completed'
        order.save()

        codigo_obj.delete()

        return Response({'message': 'Serviço encerrado com sucesso!'})

    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)
    except CodigoEncerramento.DoesNotExist:
        return Response({'error': 'Código não encontrado'}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def encerrar_servico(request, pk):
    try:
        order = Order.objects.get(pk=pk)
        prestador = Prestador.objects.get(user=request.user)

        if order.prestador != prestador:
            return Response({'error': 'Sem permissão'}, status=403)

        if order.status != 'in_progress':
            return Response({'error': 'Serviço não está em andamento'}, status=400)

        codigo_informado = request.data.get('codigo')
        codigo_obj = CodigoEncerramento.objects.get(order=order)

        if codigo_obj.codigo != codigo_informado:
            return Response({'error': 'Código inválido'}, status=400)

        order.status = 'completed'
        order.save()

        codigo_obj.delete()

        # envia email de conclusão
        send_ticket_completed_email(order.user, order, prestador)

        return Response({'message': 'Serviço encerrado com sucesso!'})

    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)
    except CodigoEncerramento.DoesNotExist:
        return Response({'error': 'Código não encontrado'}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def criar_avaliacao(request):
    """
    Cria uma avaliação após pedido concluído.
    Funciona tanto para user comum quanto para prestador —
    o serializer detecta automaticamente quem está chamando.
 
    Body: { "order": <id>, "nota": 1-5, "comentario": "..." }
    """
    serializer = CriarAvaliacaoSerializer(
        data=request.data,
        context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(
            {'message': 'Avaliação registrada com sucesso!'},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def avaliacoes_do_prestador(request, prestador_id):
    """
    Lista todas as avaliações recebidas por um prestador.
    Acessível por qualquer usuário autenticado.
    """
    avaliacoes = Avaliacao.objects.filter(
        prestador_avaliado__id=prestador_id
    ).order_by('-criado_em')
 
    media = avaliacoes.aggregate(Avg('nota'))['nota__avg']
 
    serializer = AvaliacaoSerializer(avaliacoes, many=True)
 
    return Response({
        'media': round(media, 1) if media else None,
        'total': avaliacoes.count(),
        'avaliacoes': serializer.data,
    })
 
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def minhas_avaliacoes_recebidas(request):
    """
    Prestador logado consulta as avaliações que recebeu.
    Retorna média, total e lista detalhada.
    """
    try:
        prestador = Prestador.objects.get(user=request.user)
    except Prestador.DoesNotExist:
        return Response({'error': 'Usuário não é um prestador'}, status=403)
 
    avaliacoes = Avaliacao.objects.filter(
        prestador_avaliado=prestador
    ).order_by('-criado_em')
 
    media = avaliacoes.aggregate(Avg('nota'))['nota__avg']
 
    serializer = AvaliacaoSerializer(avaliacoes, many=True)
 
    return Response({
        'media': round(media, 1) if media else None,
        'total': avaliacoes.count(),
        'avaliacoes': serializer.data,
    })
 
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def status_avaliacao_order(request, pk):
    """
    Retorna se o usuário logado já avaliou um pedido específico.
    Útil para o front decidir se exibe ou não o botão de avaliação.
 
    Retorna:
    {
      "pode_avaliar": true/false,
      "ja_avaliou": true/false,
      "motivo": "..." (quando não pode avaliar)
    }
    """
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)
 
    user = request.user
 
    # Verifica se é prestador
    try:
        prestador = Prestador.objects.get(user=user)
        is_prestador = True
    except Prestador.DoesNotExist:
        prestador    = None
        is_prestador = False
 
    # Pedido deve estar concluído
    if order.status != 'completed':
        return Response({
            'pode_avaliar': False,
            'ja_avaliou': False,
            'motivo': 'Pedido ainda não foi concluído.'
        })
 
    if is_prestador:
        if order.prestador != prestador:
            return Response({
                'pode_avaliar': False,
                'ja_avaliou': False,
                'motivo': 'Você não é o prestador deste pedido.'
            })
        ja_avaliou = Avaliacao.objects.filter(
            order=order, avaliador_prestador=prestador
        ).exists()
    else:
        if order.user != user:
            return Response({
                'pode_avaliar': False,
                'ja_avaliou': False,
                'motivo': 'Este pedido não pertence a você.'
            })
        ja_avaliou = Avaliacao.objects.filter(
            order=order, avaliador_user=user
        ).exists()
 
    return Response({
        'pode_avaliar': not ja_avaliou,
        'ja_avaliou': ja_avaliou,
        'motivo': 'Você já avaliou este pedido.' if ja_avaliou else None
    })
 

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def avaliacoes_recebidas_order(request, pk):
    """
    Retorna a avaliação que o user recebeu (do prestador) em um pedido específico.
    Só retorna se o pedido pertence ao user logado.
    """
    try:
        order = Order.objects.get(pk=pk, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Pedido não encontrado'}, status=404)
 
    avaliacoes = Avaliacao.objects.filter(
        order=order,
        user_avaliado=request.user
    ).order_by('-criado_em')
 
    serializer = AvaliacaoSerializer(avaliacoes, many=True)
 
    media = avaliacoes.aggregate(Avg('nota'))['nota__avg']
 
    return Response({
        'media': round(media, 1) if media else None,
        'total': avaliacoes.count(),
        'avaliacoes': serializer.data,
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def carteira_resumo(request):
    """
    Retorna saldo disponível, total recebido e total sacado do prestador.
    Saldo = total de pedidos completed - total de saques aprovados.
    """
    try:
        prestador = Prestador.objects.get(user=request.user)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)
 
    total_recebido = (
        Order.objects.filter(prestador=prestador, status='completed')
        .aggregate(total=Sum('value'))['total'] or 0
    )
 
    total_sacado = (
        SolicitacaoSaque.objects.filter(prestador=prestador, status='aprovado')
        .aggregate(total=Sum('valor'))['total'] or 0
    )
 
    saldo_disponivel = float(total_recebido) - float(total_sacado)
 
    # Dados bancários para exibir no modal de saque
    try:
        db = prestador.dados_bancarios
        dados_bancarios = {
            'banco':      db.banco,
            'agencia':    db.agencia,
            'conta':      db.conta,
            'tipo_pix':   db.tipo_pix,
            'chave_pix':  db.chave_pix,
        }
    except Exception:
        dados_bancarios = None
 
    return Response({
        'total_recebido':   str(total_recebido),
        'total_sacado':     str(total_sacado),
        'saldo_disponivel': f'{saldo_disponivel:.2f}',
        'dados_bancarios':  dados_bancarios,
    })
 
 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def carteira_extrato(request):
    """
    Retorna histórico unificado: serviços concluídos + saques,
    ordenados por data decrescente.
    """
    try:
        prestador = Prestador.objects.get(user=request.user)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)
 
    # Serviços concluídos
    orders = Order.objects.filter(
        prestador=prestador, status='completed'
    ).values('id', 'value', 'created_at', 'status')
 
    entradas = [
        {
            'id':        f'order_{o["id"]}',
            'tipo':      'servico',
            'order_id':  o['id'],
            'valor':     str(o['value']),
            'data':      o['created_at'],
            'status':    o['status'],
        }
        for o in orders
    ]
 
    # Saques
    saques = SolicitacaoSaque.objects.filter(prestador=prestador).values(
        'id', 'valor', 'solicitado_em', 'status'
    )
 
    saidas = [
        {
            'id':           f'saque_{s["id"]}',
            'tipo':         'saque',
            'valor':        str(s['valor']),
            'data':         s['solicitado_em'],
            'status_saque': s['status'],
        }
        for s in saques
    ]
 
    extrato = sorted(
        entradas + saidas,
        key=lambda x: x['data'],
        reverse=True
    )
 
    return Response({'extrato': extrato})
 
 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solicitar_saque(request):
    """
    Cria uma solicitação de saque.
    Body: { "valor": 150.00 }
    """
    try:
        prestador = Prestador.objects.get(user=request.user)
    except Prestador.DoesNotExist:
        return Response({'error': 'Não é um prestador'}, status=403)
 
    valor = request.data.get('valor')
 
    if not valor:
        return Response({'error': 'Informe o valor do saque.'}, status=400)
 
    try:
        valor = float(valor)
    except (TypeError, ValueError):
        return Response({'error': 'Valor inválido.'}, status=400)
 
    if valor <= 0:
        return Response({'error': 'O valor deve ser maior que zero.'}, status=400)
 
    # Recalcula saldo no backend (nunca confiar só no front)
    total_recebido = float(
        Order.objects.filter(prestador=prestador, status='completed')
        .aggregate(total=Sum('value'))['total'] or 0
    )
    total_sacado = float(
        SolicitacaoSaque.objects.filter(prestador=prestador, status='aprovado')
        .aggregate(total=Sum('valor'))['total'] or 0
    )
    saldo_disponivel = total_recebido - total_sacado
 
    if valor > saldo_disponivel:
        return Response(
            {'error': f'Saldo insuficiente. Disponível: R$ {saldo_disponivel:.2f}'},
            status=400
        )
 
    SolicitacaoSaque.objects.create(prestador=prestador, valor=valor)
 
    return Response({'message': 'Solicitação de saque criada com sucesso!'}, status=201)
 
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # 🔒 segurança: não revela se o email existe
            return Response({"message": "Se o e-mail existir, enviaremos instruções."})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        FRONTEND_URL = "http://localhost:5173"

        reset_link = f"{FRONTEND_URL}/nova-senha/{uid}/{token}"

        # 📩 envio de email
        send_mail(
            subject="Recuperação de senha - FixIt",
            message=f"""
Olá!

Recebemos uma solicitação para redefinir sua senha.

Clique no link abaixo:
{reset_link}

Se não foi você, ignore este email.
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Email enviado com sucesso"})
    
class PasswordResetConfirmView(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"error": "Token inválido"}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token inválido ou expirado"}, status=400)

        user.set_password(password)
        user.save()

        return Response({"message": "Senha atualizada com sucesso"})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_prestadores(request):
    """
    Lista prestadores ativos com média de avaliação e total de serviços.
    Query param opcional: ?servico=faxina_residencial
    """
    servico = request.query_params.get('servico', None)
 
    qs = Prestador.objects.filter(ativo=True)
 
    if servico:
        qs = qs.filter(servico=servico)
 
    prestadores = qs.annotate(
        media_avaliacao=Avg('avaliacoes_recebidas__nota'),
        total_avaliacoes=Count('avaliacoes_recebidas'),
        total_servicos_count=Count('orders', filter=Q(orders__status='completed')),
    )
 
    data = []
    for p in prestadores:
        foto_url = request.build_absolute_uri(p.foto.url) if p.foto else None
        data.append({
            'id':               p.id,
            'nome':             p.nome,
            'servico':          p.servico,
            'anos_experiencia': p.anos_experiencia,
            'cidade':           p.cidade,
            'foto':             foto_url,
            'media_avaliacao':  round(p.media_avaliacao, 1) if p.media_avaliacao else None,
            'total_avaliacoes': p.total_avaliacoes,
            'total_servicos':   p.total_servicos_count,
        })
 
    return Response(data)
 