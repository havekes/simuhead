import os
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import Instance, Pak, Save
from .local import LocalInstance, LocalInstanceBuildError


@receiver(post_save, sender=Instance)
def on_instance_save(instance, **kwargs):
    """Whenever any instance config values are changed, save them to the config file and reload the server"""
    local_instance = LocalInstance(instance.name)
    local_instance.config = instance
    try:
        if local_instance.is_running:
            local_instance.reload()
        else:
            local_instance.install()
    except LocalInstanceBuildError:
        pass


@receiver(post_delete, sender=Instance)
def on_instance_delete(instance, **kwargs):
    """Whenever an instance is deleted, also delete the configuration and logs related to the instance"""
    local_instance = LocalInstance(instance.name)
    local_instance.remove()


@receiver(post_delete, sender=Save)
@receiver(post_delete, sender=Pak)
def on_file_delete(instance, **kwargs):
    """Whenever a save or a pak is deleted, also delete the file"""
    try:
        os.remove(instance.file.path)
    except FileNotFoundError:
        return
