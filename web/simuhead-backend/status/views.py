from rest_framework import viewsets
from .serializers import InstanceSerializer
from .models import Instance


class InstanceViewSet(viewsets.ModelViewSet):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()
