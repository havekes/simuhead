from rest_framework import serializers
from .models import Instance


class InstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instance
        fields = ('name', 'port', 'revision', 'lang')
