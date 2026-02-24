from django.db import models
from django.contrib.auth.models import User
import random
from django.utils import timezone
from datetime import timedelta


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

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)

    address = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()

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


