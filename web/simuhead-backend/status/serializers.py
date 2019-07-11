from rest_framework import serializers
from .models import Instance
from .run import instance_status_code


class InstanceSerializer(serializers.ModelSerializer):
    status_code = serializers.SerializerMethodField()

    def get_status_code(self, instance):
        return instance_status_code(instance.name)

    class Meta:
        model = Instance
        fields = '__all__'
