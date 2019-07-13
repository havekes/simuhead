from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import Instance
from .local import LocalInstance


@receiver(post_save, sender=Instance)
def on_instance_save(instance, **kwargs):
    """
    Whenever any instance config values are changed, save them to the config file and reload the server
    """
    local_instance = LocalInstance(instance.name)
    local_instance.config = instance


@receiver(post_delete, sender=Instance)
def on_instance_delete(instance, **kwargs):
    """
    Whenever
    """
    local_instance = LocalInstance(instance.name)
    local_instance.remove()
