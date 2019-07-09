from django.apps import AppConfig


class StatusConfig(AppConfig):
    name = 'status'

    def ready(self):
        print('Ready')
        import status.signals
