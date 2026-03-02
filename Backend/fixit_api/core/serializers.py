import re
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

    def validate(self, data):
        service = data.get("service")

        # Se for faxina residencial
        if service.tipo == "faxina_residencial":
            required_fields = [
                "tipo_faxina",
                "tipo_imovel",
                "quartos",
                "banheiros",
                "metragem",
                "cep",
                "logradouro",
                "numero"
            ]

            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(
                        {field: "Este campo é obrigatório para faxina residencial."}
                    )

        return data


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
