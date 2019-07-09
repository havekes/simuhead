from django.shortcuts import render
from rest_framework.views import APIView
from web.simuhead.simuhead.run import instances


class InstanceList(APIView):
    def list_installed(self):
        pass
