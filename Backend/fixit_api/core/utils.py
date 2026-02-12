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
