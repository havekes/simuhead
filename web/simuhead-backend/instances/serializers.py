from rest_framework import serializers
from .models import Pak, Save, Instance
from .local import LocalInstance


class PakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pak
        fields = '__all__'


class SaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Save
        fields = '__all__'


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    status = serializers.SerializerMethodField()

    def get_status(self, instance):
        local_instance = LocalInstance(instance.name)
        return local_instance.status_code()

    class Meta:
        model = Instance
        fields = '__all__'
