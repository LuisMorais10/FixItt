import re
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Prestador, Profile, DadosBancarios, Order


class DadosBancariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = DadosBancarios
        exclude = ['prestador']  # prestador é setado automaticamente no create
 
 
class PrestadorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    dados_bancarios = DadosBancariosSerializer(required=False, allow_null=True)
 
    class Meta:
        model = Prestador
        fields = '__all__'
 
    def create(self, validated_data):
        password = validated_data.pop('password')
        dados_bancarios_data = validated_data.pop('dados_bancarios', None)
        telefone = validated_data.get('telefone')
 
        user = User.objects.create_user(
            username=telefone,
            password=password,
        )
        prestador = Prestador.objects.create(user=user, **validated_data)
 
        # Cria dados bancários se enviados
        if dados_bancarios_data:
            DadosBancarios.objects.create(prestador=prestador, **dados_bancarios_data)
 
        return prestador


class PrestadorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        from .models import Prestador
        model = Prestador
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password')
        telefone = validated_data.get('telefone')

        user = User.objects.create_user(
            username=telefone,
            password=password,
        )
        prestador = Prestador.objects.create(user=user, **validated_data)
        return prestador

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        from .models import Profile
        model = Profile
        fields = ['telefone']

class UserDataSerializer(serializers.ModelSerializer):
    telefone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'telefone']

    def get_telefone(self, obj):
        try:
            return obj.profile.telefone
        except:
            return ''

class UserUpdateSerializer(serializers.ModelSerializer):
    telefone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'telefone']

    def update(self, instance, validated_data):
        telefone = validated_data.pop('telefone', None)

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        if telefone is not None:
            from .models import Profile
            profile, _ = Profile.objects.get_or_create(user=instance)
            profile.telefone = telefone
            profile.save()

        return instance



class OrderSerializer(serializers.ModelSerializer):
    service_nome = serializers.CharField(source='service.nome', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

    def validate(self, data):
        if self.instance:  # update
            return data

        service = data.get("service")

        if not service:
            return data

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
    first_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "telefone","first_name")

    def validate_password(self, value):
        regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$'

        if not re.match(regex, value):
            raise serializers.ValidationError(
                "A senha deve conter no mínimo 8 caracteres, "
                "uma letra maiúscula, uma minúscula, um número e um caractere especial."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        telefone = validated_data.get('telefone')

        if User.objects.filter(username=telefone).exists():
            raise serializers.ValidationError({'telefone': 'Este telefone já está cadastrado.'})

        user = User.objects.create_user(
            username=telefone,
            password=password,
        )
        prestador = Prestador.objects.create(user=user, **validated_data)
    
        return prestador
