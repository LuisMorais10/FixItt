from django.db import models
from django.contrib.auth.models import User
import random
from django.utils import timezone
from datetime import timedelta

class Prestador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

    SERVICO_CHOICES = [
        ('faxina_residencial', 'Faxina Residencial'),
        ('faxina_empresarial', 'Faxina Empresarial'),
        ('hotelaria', 'Apoio a Redes Hoteleiras'),
        ('mudanca', 'Mudança'),
        ('eletrodomesticos', 'Técnico de Eletrodomésticos'),
        ('eletricista', 'Eletricista'),
        ('servicos_gerais', 'Serviços Gerais'),
    ]
 
    # Dados pessoais
    foto = models.ImageField(upload_to='prestadores/', null=True, blank=True)
    nome = models.CharField(max_length=150)
    telefone = models.CharField(max_length=20)
    cpf = models.CharField(max_length=14, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
 
    # Localização
    cep = models.CharField(max_length=10)
    cidade = models.CharField(max_length=255, blank=True)
 
    # Serviço
    servico = models.CharField(max_length=255, blank=True)
    eletrodomesticos = models.TextField(blank=True, null=True)  # só se servico == eletrodomesticos
    comentarios = models.TextField(blank=True, null=True)
    anos_experiencia = models.PositiveIntegerField()
 
    # Consentimento
    aceita_contato = models.BooleanField(default=False)
 
    # Controle
    cadastrado_em = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)
    doc_frente = models.ImageField(upload_to='prestadores/docs/', null=True, blank=True)
    doc_verso = models.ImageField(upload_to='prestadores/docs/', null=True, blank=True)
    comprovante = models.ImageField(upload_to='prestadores/comprovantes/', null=True, blank=True)
 
    def __str__(self):
        return f"{self.nome} - {self.servico}"

class DadosBancarios(models.Model):
    TIPO_CONTA_CHOICES = [
        ('corrente', 'Conta Corrente'),
        ('poupanca', 'Conta Poupança'),
    ]
 
    TIPO_PIX_CHOICES = [
        ('cpf', 'CPF'),
        ('telefone', 'Telefone'),
        ('email', 'E-mail'),
        ('aleatoria', 'Chave Aleatória'),
    ]
 
    BANCOS = [
        ('001', 'Banco do Brasil'),
        ('033', 'Santander'),
        ('077', 'Inter'),
        ('104', 'Caixa Econômica Federal'),
        ('237', 'Bradesco'),
        ('260', 'Nubank'),
        ('341', 'Itaú'),
        ('422', 'Safra'),
        ('756', 'Sicoob'),
        ('748', 'Sicredi'),
        ('336', 'C6 Bank'),
        ('380', 'PicPay'),
        ('290', 'PagBank'),
        ('323', 'Mercado Pago'),
        ('outro', 'Outro'),
    ]
 
    prestador = models.OneToOneField(
        Prestador,
        on_delete=models.CASCADE,
        related_name='dados_bancarios'
    )
 
    # Dados da conta
    banco = models.CharField(max_length=10, choices=BANCOS, blank=True, null=True)
    agencia = models.CharField(max_length=10, blank=True, null=True)
    conta = models.CharField(max_length=20, blank=True, null=True)
    tipo_conta = models.CharField(max_length=10, choices=TIPO_CONTA_CHOICES, blank=True, null=True)
 
    # PIX
    tipo_pix = models.CharField(max_length=10, choices=TIPO_PIX_CHOICES, blank=True, null=True)
    chave_pix = models.CharField(max_length=150, blank=True, null=True)
 
    atualizado_em = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return f"Dados bancários de {self.prestador.nome}"


class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telefone = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username


class Service(models.Model):
    SERVICE_TYPES = [
        ('faxina_residencial', 'Faxina Residencial'),
        ('faxina_empresarial', 'Faxina Empresarial'),
        ('hotelaria', 'Apoio a Redes Hoteleiras'),
        ('mudanca', 'Mudança'),
        ('eletrodomesticos', 'Técnico de Eletrodomésticos'),
        ('eletricista', 'Eletricista'),
        ('servicos_gerais', 'Serviços Gerais'),
    ]

    nome = models.CharField(max_length=100)
    tipo = models.CharField(
        max_length=50,
        choices=SERVICE_TYPES,
        default='servicos_gerais'
    )
    descricao = models.TextField()
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('confirmed', 'Confirmado'),
        ('in_progress', 'Em andamento'),
        ('completed', 'Concluído'),
        ('canceled', 'Cancelado'),
    ]

    FAXINA_TIPO_CHOICES = [
        ('padrao', 'Faxina Padrão'),
        ('diaria_completa', 'Diária Completa'),
    ]

    IMOVEL_CHOICES = [
        ('casa', 'Casa'),
        ('apartamento', 'Apartamento'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)
    prestador = models.ForeignKey(
        'Prestador',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )

    # 🔥 NOVOS CAMPOS
    tipo_faxina = models.CharField(
        max_length=20,
        choices=FAXINA_TIPO_CHOICES,
        null=True,
        blank=True
    )

    tipo_imovel = models.CharField(
        max_length=20,
        choices=IMOVEL_CHOICES,
        null=True,
        blank=True
    )

    quartos = models.IntegerField(null=True, blank=True)
    banheiros = models.IntegerField(null=True, blank=True)
    metragem = models.IntegerField(null=True, blank=True)
    cep = models.CharField(max_length=20, null=True, blank=True)
    cidade = models.CharField(max_length=100,default="Não informado")
    bairro = models.CharField(max_length=100,default="Não informado")
    logradouro = models.CharField(max_length=255, null=True, blank=True)
    numero = models.CharField(max_length=20, null=True, blank=True)
    complemento = models.CharField(max_length=255, null=True, blank=True)
    materiais_limpeza = models.CharField(max_length=502, null=True, blank=True)

    address = models.CharField(max_length=255, blank=True, null=True)

    date = models.DateField()
    time = models.TimeField(blank=True, null=True)

    description = models.TextField(blank=True)

    value = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.user.username}"


class CodigoEncerramento(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='codigo_encerramento')
    codigo = models.CharField(max_length=6)
    criado_em = models.DateTimeField(auto_now_add=True)

    @staticmethod
    def generate_code():
        return str(random.randint(100000, 999999))

    def __str__(self):
        return f"Código do pedido #{self.order.id}"
 
    
class Avaliacao(models.Model):
    """
    Avaliação bidirecional após conclusão do pedido.
    - avaliador_user  → usuário comum que avalia o prestador
    - avaliador_prestador → prestador que avalia o usuário
    Apenas um dos dois pode ser preenchido por instância.
    """
 
    NOTA_CHOICES = [(i, str(i)) for i in range(1, 6)]
 
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='avaliacoes'
    )
 
    # Quem avalia quem
    avaliador_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='avaliacoes_feitas'
    )
    avaliador_prestador = models.ForeignKey(
        'Prestador',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='avaliacoes_feitas'
    )
 
    # Quem é avaliado
    prestador_avaliado = models.ForeignKey(
        'Prestador',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='avaliacoes_recebidas'
    )
    user_avaliado = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='avaliacoes_recebidas'
    )
 
    nota = models.PositiveSmallIntegerField(choices=NOTA_CHOICES)
    comentario = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        constraints = [
            # Garante que user avalia prestador uma única vez por pedido
            models.UniqueConstraint(
                fields=['order', 'avaliador_user'],
                condition=models.Q(avaliador_user__isnull=False),
                name='unique_avaliacao_user_por_order'
            ),
            # Garante que prestador avalia user uma única vez por pedido
            models.UniqueConstraint(
                fields=['order', 'avaliador_prestador'],
                condition=models.Q(avaliador_prestador__isnull=False),
                name='unique_avaliacao_prestador_por_order'
            ),
        ]
 
    def __str__(self):
        if self.avaliador_user:
            return f"Pedido #{self.order.id} — User avaliou Prestador — {self.nota}★"
        return f"Pedido #{self.order.id} — Prestador avaliou User — {self.nota}★"
 
 
class SolicitacaoSaque(models.Model):
    STATUS_CHOICES = [
        ('pendente',  'Pendente'),
        ('aprovado',  'Aprovado'),
        ('recusado',  'Recusado'),
    ]
 
    prestador   = models.ForeignKey(
        'Prestador', on_delete=models.CASCADE, related_name='saques'
    )
    valor       = models.DecimalField(max_digits=10, decimal_places=2)
    status      = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pendente')
    solicitado_em = models.DateTimeField(auto_now_add=True)
    processado_em = models.DateTimeField(null=True, blank=True)
    observacao  = models.TextField(blank=True, null=True)
 
    def __str__(self):
        return f"Saque de {self.prestador.nome} — R$ {self.valor} ({self.status})"