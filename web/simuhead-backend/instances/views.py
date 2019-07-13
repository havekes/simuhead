from rest_framework import viewsets
from .serializers import PakSerializer, SaveSerializer, InstanceSerializer
from .models import Pak, Save, Instance


class PakViewSet(viewsets.ModelViewSet):
    serializer_class = PakSerializer
    queryset = Pak.objects.all()


class SaveViewSet(viewsets.ModelViewSet):
    serializer_class = SaveSerializer
    queryset = Save.objects.all()


class InstanceViewSet(viewsets.ModelViewSet):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()
