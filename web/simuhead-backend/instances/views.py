from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.generics import RetrieveAPIView
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR
from .serializers import PakSerializer, SaveSerializer, InstanceSerializer
from .models import Pak, Save, Instance
from .local import LocalInstance, LocalInstanceError


class PakViewSet(viewsets.ModelViewSet):
    serializer_class = PakSerializer
    queryset = Pak.objects.all()


class SaveViewSet(viewsets.ModelViewSet):
    serializer_class = SaveSerializer
    queryset = Save.objects.all()


class InstanceViewSet(viewsets.ModelViewSet):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()

    def list(self, request, *args, **kwargs):
        return super(InstanceViewSet, self).list(request, *args, **kwargs)


class InstanceView(RetrieveAPIView):
    queryset = Instance.objects.all()

    def __init__(self):
        super(InstanceView, self).__init__()
        instance = self.get_object()
        self.local_instance = LocalInstance(instance.name)


class InstanceStartView(InstanceView):
    def get(self, request, **kwargs):
        self.local_instance.start()
        return super(InstanceStartView, self).get(request, **kwargs)


class InstanceInstallView(InstanceView):
    def get(self, request, **kwargs):
        self.local_instance.install()
        return super(InstanceInstallView, self).get(request, **kwargs)


def custom_exception_handler(exc, context=None):
    response = exception_handler(exc, context)

    if isinstance(exc, LocalInstanceError):
        response = Response(exc.message, status=HTTP_500_INTERNAL_SERVER_ERROR)

    return response
