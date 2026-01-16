from django.db import models


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




