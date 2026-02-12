import re
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    telefone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "telefone")

    def validate_password(self, value):
        regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$'

        if not re.match(regex, value):
            raise serializers.ValidationError(
                "A senha deve conter no mínimo 8 caracteres, "
                "uma letra maiúscula, uma minúscula, um número e um caractere especial."
            )
        return value

    def create(self, validated_data):
        telefone = validated_data.pop("telefone")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            is_active=False  # bloqueado até verificar
        )

        Profile.objects.create(
            user=user,
            telefone=telefone
        )

        return user
