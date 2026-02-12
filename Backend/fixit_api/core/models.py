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




