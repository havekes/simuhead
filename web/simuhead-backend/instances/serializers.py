from rest_framework import serializers
from .models import Pak, Save, Revision, Instance
from .local import LocalInstance, LocalInstanceError


class ProtectedSerializer(serializers.HyperlinkedModelSerializer):
    protected = serializers.SerializerMethodField()

    def get_protected(self, instance):
        if instance.instance_set.count() > 0:
            return True
        else:
            return False


class PakSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Pak
        fields = '__all__'


class SaveSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Save
        fields = '__all__'


class RevisionSerializer(ProtectedSerializer):
    class Meta:
        model = Revision
        fields = '__all__'


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Instance
        fields = '__all__'

    def get_status(self, instance):
        try:
            local_instance = LocalInstance(instance.name)
            status_code = local_instance.status_code()
        except LocalInstanceError as e:
            return e.message
        else:
            return status_code
