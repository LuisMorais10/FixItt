import re
from urllib import request
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Prestador, Profile, DadosBancarios, Order
from .models import Avaliacao


class AvaliacaoSerializer(serializers.ModelSerializer):
    """Leitura de avaliações — expõe quem avaliou e quem foi avaliado."""
    avaliador_nome = serializers.SerializerMethodField()
    avaliado_nome  = serializers.SerializerMethodField()
 
    class Meta:
        model  = Avaliacao
        fields = [
            'id', 'order', 'nota', 'comentario', 'criado_em',
            'avaliador_nome', 'avaliado_nome',
            # campos raw (úteis para lógica no front)
            'avaliador_user', 'avaliador_prestador',
            'prestador_avaliado', 'user_avaliado',
        ]
 
    def get_avaliador_nome(self, obj):
        if obj.avaliador_user:
            return obj.avaliador_user.first_name or obj.avaliador_user.email
        if obj.avaliador_prestador:
            return obj.avaliador_prestador.nome
        return ''
 
    def get_avaliado_nome(self, obj):
        if obj.prestador_avaliado:
            return obj.prestador_avaliado.nome
        if obj.user_avaliado:
            return obj.user_avaliado.first_name or obj.user_avaliado.email
        return ''
 
 
class CriarAvaliacaoSerializer(serializers.ModelSerializer):
    """Criação de avaliação — valida regras de negócio."""
 
    class Meta:
        model  = Avaliacao
        fields = ['order', 'nota', 'comentario']
 
    def validate(self, data):
        request = self.context['request']
        order   = data['order']
        user    = request.user
 
        # 1. Pedido deve estar concluído
        if order.status != 'completed':
            raise serializers.ValidationError(
                "Só é possível avaliar pedidos concluídos."
            )
 
        # 2. Detecta se quem chama é user comum ou prestador
        try:
            prestador = Prestador.objects.get(user=user)
            is_prestador = True
        except Prestador.DoesNotExist:
            prestador    = None
            is_prestador = False
 
        if is_prestador:
            # Prestador só avalia seu próprio pedido
            if order.prestador != prestador:
                raise serializers.ValidationError(
                    "Você não participou deste pedido."
                )
            # Verifica duplicidade
            if Avaliacao.objects.filter(order=order, avaliador_prestador=prestador).exists():
                raise serializers.ValidationError(
                    "Você já avaliou este pedido."
                )
            data['avaliador_prestador'] = prestador
            data['user_avaliado']       = order.user
 
        else:
            # User só avalia seu próprio pedido
            if order.user != user:
                raise serializers.ValidationError(
                    "Você não participou deste pedido."
                )
            # Verifica duplicidade
            if Avaliacao.objects.filter(order=order, avaliador_user=user).exists():
                raise serializers.ValidationError(
                    "Você já avaliou este pedido."
                )
            data['avaliador_user']      = user
            data['prestador_avaliado']  = order.prestador
 
        return data


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

        if dados_bancarios_data:
            DadosBancarios.objects.create(prestador=prestador, **dados_bancarios_data)

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
    

class PrestadorResumoSerializer(serializers.ModelSerializer):
    media_avaliacao = serializers.SerializerMethodField()
    total_avaliacoes = serializers.SerializerMethodField()

    class Meta:
        model  = Prestador
        fields = ['id', 'nome', 'telefone', 'servico',
                  'anos_experiencia', 'foto',
                  'media_avaliacao', 'total_avaliacoes']   # ← adicionados

    def get_media_avaliacao(self, obj):
        from django.db.models import Avg
        resultado = obj.avaliacoes_recebidas.aggregate(Avg('nota'))
        media = resultado['nota__avg']
        return round(media, 1) if media else None

    def get_total_avaliacoes(self, obj):
        return obj.avaliacoes_recebidas.count()
    


class UserResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']



class OrderSerializer(serializers.ModelSerializer):
    service_nome = serializers.CharField(source='service.nome', read_only=True)
    prestador_detalhes = PrestadorResumoSerializer(source='prestador', read_only=True)
    user_detalhes = UserResumoSerializer(source='user', read_only=True)
    codigo_encerramento = serializers.SerializerMethodField()
    ja_avaliado_pelo_user      = serializers.SerializerMethodField()
    ja_avaliado_pelo_prestador = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['user', 'status', 'created_at']

    def get_ja_avaliado_pelo_user(self, obj):
        request = self.context.get('request')

        if not request:
            return False
        
        return Avaliacao.objects.filter(
            order=obj, avaliador_user=request.user
        ).exists()

    def get_ja_avaliado_pelo_prestador(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        try:
            prestador = Prestador.objects.get(user=request.user)
            return Avaliacao.objects.filter(
                order=obj, avaliador_prestador=prestador
            ).exists()
        except Prestador.DoesNotExist:
            return False
 

    def get_codigo_encerramento(self, obj):
        try:
            return obj.codigo_encerramento.codigo
        except:
            return None    

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
        fields = ("email", "password", "telefone", "first_name")

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
        telefone = validated_data.pop('telefone')
        email = validated_data.get('email')

        if User.objects.filter(username=telefone).exists():
            raise serializers.ValidationError({'telefone': 'Este telefone já está cadastrado.'})

        user = User.objects.create_user(
            username=email,
            password=password,
            first_name=validated_data.get('first_name', ''),
            email=validated_data.get('email', '')
        )

        # ✅ cria profile (usuario comum)
        Profile.objects.create(
            user=user,
            telefone=telefone
        )

        return user