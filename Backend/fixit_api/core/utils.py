from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import EmailVerification


def send_verification_email(user):
    code = EmailVerification.generate_code()

    expires = timezone.now() + timedelta(minutes=10)

    EmailVerification.objects.update_or_create(
        user=user,
        defaults={
            "code": code,
            "expires_at": expires,
        },
    )

    send_mail(
        "Verifique sua conta - FixIt",
        f"Seu código de verificação é: {code}",
        None,
        [user.email],
    )



def send_order_confirmation_email(user, order):
    send_mail(
        subject="Solicitação recebida - FixIt",
        message=f"""
Olá {user.first_name or user.username},

Recebemos sua solicitação de serviço! Aqui estão os detalhes:

Pedido: #{order.id}
Serviço: {order.service.nome}
Data: {order.date.strftime('%d/%m/%Y')}
Endereço: {order.logradouro}, {order.numero} - {order.bairro}, {order.cidade}

Nossa equipe entrará em contato em breve para confirmar o agendamento.

Equipe FixIt
        """,
        from_email=None,
        recipient_list=[user.email],
    )




def send_order_accepted_email(user, order, prestador):
    send_mail(
        subject="Seu pedido foi aceito! 🎉 - FixIt",
        message=f"""
Olá {user.first_name or user.username},

Boa notícia! Seu pedido foi aceito por um prestador.

Detalhes do pedido:
Pedido: #{order.id}
Serviço: {order.service.nome}
Data: {order.date.strftime('%d/%m/%Y')}

Prestador:
Nome: {prestador.nome}
Telefone: {prestador.telefone}

Endereço:
{order.logradouro}, {order.numero} - {order.bairro}, {order.cidade}

Em breve o prestador poderá entrar em contato com você.

Equipe FixIt
        """,
        from_email=None,
        recipient_list=[user.email],
    )