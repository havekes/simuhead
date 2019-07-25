import os
from rest_framework import viewsets
from .serializers import PakSerializer, SaveSerializer, InstanceSerializer
from .models import Pak, Save, Instance


class PakViewSet(viewsets.ModelViewSet):
    serializer_class = PakSerializer
    queryset = Pak.objects.all()

    def destroy(self, request, *args, **kwargs):
        """Remove the pak file before removing from the model"""
        pak = self.get_object()
        os.remove(pak.file.path)
        return super(PakViewSet, self).destroy(request, *args, **kwargs)


class SaveViewSet(viewsets.ModelViewSet):
    serializer_class = SaveSerializer
    queryset = Save.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        """Remove the save file before removing from the model"""
        save = self.get_object()
        os.remove(save.file.path)
        return super(SaveViewSet, self).destroy(request, *args, **kwargs)


class InstanceViewSet(viewsets.ModelViewSet):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()
