from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import EmailVerification
from django.core.mail import EmailMultiAlternatives
from django.conf import settings



def base_email_template(content):
    return f"""
    <div style="background:#eef2f7; padding:40px 20px; font-family:Arial, sans-serif;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <div style="text-align:center; padding:20px;">
            <img src="https://i.imgur.com/3EccDHc.jpeg"
                alt="FixIt"
                width="120"
                style="border:0;">
            </div>

            <!-- CONTENT -->
            <div style="padding:30px;">
                {content}
            </div>

        </div>

        <!-- FOOTER -->
        <div style="text-align:center; font-size:12px; color:#888; margin-top:15px;">
            © FixIt • Serviços sob demanda
        </div>

    </div>
    """


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

    content = f"""
        <h2 style="margin-top:0;">Verifique sua conta</h2>

        <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

        <p>Para ativar sua conta na FixIt, utilize o código abaixo:</p>

        <div style="
            background:#f4f6f8;
            padding:20px;
            border-radius:10px;
            text-align:center;
            margin:25px 0;
        ">

        <div style="
            display:inline-block;
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            background:#0B3C8A;
            color:#fff;
            padding:14px 24px;
            border-radius:8px;
        ">
        {code}
    </div>

</div>

        <p>Esse código expira em <strong>10 minutos</strong>.</p>

        <p style="font-size:14px; color:#777;">
            Se você não criou uma conta, pode ignorar este email.
        </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Verificação de conta - FixIt",
        html
    )


def send_order_confirmation_email(user, order):

    content = f"""
    <h2 style="margin-top:0;">Pedido recebido ✅</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Recebemos sua solicitação e já estamos cuidando disso pra você! 🚀</p>

    <!-- DETALHES DO PEDIDO -->
    <div style="
        background:#f4f6f8;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">

        <p style="margin:0;"><strong>Pedido:</strong> #{order.id}</p>
        <p style="margin:5px 0;"><strong>Serviço:</strong> {order.service.nome}</p>
        <p style="margin:5px 0;"><strong>Data:</strong> {order.date.strftime('%d/%m/%Y')}</p>
        <p style="margin:5px 0;">
            <strong>Endereço:</strong> {order.logradouro}, {order.numero} - {order.bairro}, {order.cidade}
        </p>

    </div>

    <!-- STATUS -->
    <div style="text-align:center; margin:25px 0;">

        <span style="
            display:inline-block;
            background:#FFB020;
            color:#000;
            padding:10px 18px;
            border-radius:20px;
            font-weight:bold;
        ">
            Buscando profissional...
        </span>

    </div>

    <p>Estamos procurando um profissional próximo de você para atender seu pedido.</p>

    <p>Assim que alguém aceitar, você será avisado imediatamente 😉</p>

    <p style="font-size:14px; color:#777;">
        Você pode acompanhar o status pela plataforma.
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Solicitação recebida - FixIt",
        html
    )


def send_order_accepted_email(user, order, prestador):

    content = f"""
    <h2 style="margin-top:0;">Profissional confirmado 👨‍🔧</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Boa notícia! Um profissional aceitou seu pedido 🎉</p>

    <!-- PRESTADOR -->
    <div style="
        background:#f4f6f8;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">

        <p style="margin:0;"><strong>{prestador.nome}</strong></p>
        <p style="margin:5px 0;">📞 {prestador.telefone}</p>

    </div>

    <!-- DETALHES DO PEDIDO -->
    <div style="
        background:#f9fafb;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">

        <p style="margin:0;"><strong>Pedido:</strong> #{order.id}</p>
        <p style="margin:5px 0;"><strong>Serviço:</strong> {order.service.nome}</p>
        <p style="margin:5px 0;"><strong>Data:</strong> {order.date.strftime('%d/%m/%Y')}</p>
        <p style="margin:5px 0;">
            <strong>Endereço:</strong> {order.logradouro}, {order.numero} - {order.bairro}, {order.cidade}
        </p>

    </div>

    <!-- STATUS -->
    <div style="text-align:center; margin:25px 0;">

        <span style="
            display:inline-block;
            background:#0B3C8A;
            color:#fff;
            padding:10px 18px;
            border-radius:20px;
            font-weight:bold;
        ">
            Profissional confirmado
        </span>

    </div>

    <p>O profissional pode entrar em contato com você em breve para alinhar os detalhes.</p>

    <p>Fique atento ao celular 📱</p>

    <p style="font-size:14px; color:#777;">
        Você também pode acompanhar tudo pela plataforma.
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Seu pedido foi aceito! 🎉 - FixIt",
        html
    )

def send_codigo_encerramento_email(user, order, codigo):

    content = f"""
    <h2 style="margin-top:0;">Código de encerramento 🔐</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Seu serviço está em andamento! Quando o prestador finalizar, informe o código abaixo para confirmar o encerramento.</p>

    <!-- CÓDIGO -->
    <div style="
        background:#f4f6f8;
        padding:25px;
        border-radius:12px;
        text-align:center;
        margin:25px 0;
    ">

        <div style="
            display:inline-block;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            background:#0B3C8A;
            color:#fff;
            padding:16px 28px;
            border-radius:10px;
        ">
            {codigo}
        </div>

    </div>

    <!-- DETALHES -->
    <div style="
        background:#f9fafb;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">

        <p style="margin:0;"><strong>Pedido:</strong> #{order.id}</p>
        <p style="margin:5px 0;"><strong>Serviço:</strong> {order.service.nome}</p>
        <p style="margin:5px 0;"><strong>Data:</strong> {order.date.strftime('%d/%m/%Y')}</p>

    </div>

    <!-- ALERTA -->
    <div style="
        background:#fff4e5;
        padding:15px;
        border-radius:8px;
        margin:25px 0;
        font-size:14px;
    ">
        ⚠️ <strong>Importante:</strong> só compartilhe este código quando o serviço estiver totalmente concluído.
    </div>

    <p style="font-size:14px; color:#777;">
        Esse código garante a segurança do seu atendimento.
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Código de encerramento do serviço - FixIt",
        html
    )

def send_ticket_completed_email(user, order, prestador):

    content = f"""
    <h2 style="margin-top:0;">Serviço finalizado 🎉</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Seu serviço foi concluído com sucesso! Esperamos que tenha sido uma ótima experiência 😊</p>

    <!-- PRESTADOR -->
    <div style="
        background:#f4f6f8;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">
        <p style="margin:0;"><strong>{prestador.nome}</strong></p>
    </div>

    <!-- DETALHES -->
    <div style="
        background:#f9fafb;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">
        <p style="margin:0;"><strong>Pedido:</strong> #{order.id}</p>
        <p style="margin:5px 0;"><strong>Serviço:</strong> {order.service.nome}</p>
        <p style="margin:5px 0;"><strong>Data:</strong> {order.date.strftime('%d/%m/%Y')}</p>
    </div>

    <!-- STATUS -->
    <div style="text-align:center; margin:25px 0;">
        <span style="
            display:inline-block;
            background:#22c55e;
            color:#fff;
            padding:10px 18px;
            border-radius:20px;
            font-weight:bold;
        ">
            Finalizado
        </span>
    </div>

    <!-- CTA AVALIAÇÃO -->
    <div style="text-align:center; margin:30px 0;">

        <p style="margin-bottom:15px; font-weight:bold;">
            Como foi sua experiência?
        </p>

        <a href="http://localhost:5173/avaliar/{order.id}"
           style="
            display:inline-block;
            background:#0B3C8A;
            color:#fff;
            padding:14px 24px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
            font-size:16px;
        ">
            Avaliar serviço ⭐
        </a>

    </div>

    <p>Sua avaliação ajuda outros clientes e melhora ainda mais a plataforma.</p>

    <p style="font-size:14px; color:#777;">
        Obrigado por usar a FixIt 💙
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Serviço concluído! Avalie sua experiência - FixIt",
        html
    )

def send_email_html(to_email, subject, html_content):
    msg = EmailMultiAlternatives(
        subject,
        "Seu cliente de email não suporta HTML.",
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def send_password_reset_email(user, reset_link):

    content = f"""
    <h2 style="margin-top:0;">Redefinir senha 🔐</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Recebemos uma solicitação para redefinir sua senha.</p>

    <p>Clique no botão abaixo para criar uma nova senha:</p>

    <div style="text-align:center; margin:30px 0;">

        <a href="{reset_link}"
           style="
            display:inline-block;
            background:#0B3C8A;
            color:#fff;
            padding:14px 24px;
            border-radius:10px;
            text-decoration:none;
            font-weight:bold;
            font-size:16px;
        ">
            Redefinir senha
        </a>

    </div>

    <div style="
        background:#fff4e5;
        padding:15px;
        border-radius:8px;
        margin:25px 0;
        font-size:14px;
    ">
        ⚠️ Se você não solicitou, ignore este email.
    </div>

    <p style="font-size:14px; color:#777;">
        Por segurança, este link pode expirar em breve.
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Recuperação de senha - FixIt",
        html
    )

def send_commercial_contact_email(user, mensagem):

    content = f"""
    <h2 style="margin-top:0;">Recebemos sua solicitação 🏢</h2>

    <p>Olá <strong>{user.first_name or user.username}</strong>,</p>

    <p>Recebemos seu contato para <strong>atendimento empresarial</strong>.</p>

    <!-- MENSAGEM -->
    <div style="
        background:#f4f6f8;
        padding:20px;
        border-radius:10px;
        margin:25px 0;
    ">
        <p style="margin:0; white-space:pre-line;">
            {mensagem}
        </p>
    </div>

    <!-- STATUS -->
    <div style="text-align:center; margin:25px 0;">
        <span style="
            display:inline-block;
            background:#0B3C8A;
            color:#fff;
            padding:10px 18px;
            border-radius:20px;
            font-weight:bold;
        ">
            Em análise
        </span>
    </div>

    <p>Nossa equipe entrará em contato em breve para entender melhor sua necessidade e montar a melhor solução.</p>

    <p style="font-size:14px; color:#777;">
        A FixIt conecta empresas a profissionais qualificados com rapidez e segurança.
    </p>
    """

    html = base_email_template(content)

    send_email_html(
        user.email,
        "Recebemos sua solicitação empresarial - FixIt",
        html
    )