from django.apps import AppConfig


class StatusConfig(AppConfig):
    name = 'instances'

    def ready(self):
        print('Ready')
        import instances.signals
