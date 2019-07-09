import configparser
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Instance
from web.simuhead.simuhead.run import instance_create_dir, instance_config_path, instance_reload


@receiver(post_save, sender=Instance)
def on_instance_config_save(instance, **kwargs):
    """
    Whenever the any instance values are changed, saved them to the config file and reload the server
    """

    print(instance.name)

    config = configparser.ConfigParser()
    config['server'] = {
        'port': instance.port,
        'revision': instance.revision,
        'lang': instance.lang,
    }

    # Make sure the instance directory exists
    instance_create_dir(instance.name)

    # Save the config file
    with open(instance_config_path(instance.name), 'w') as config_file:
        config.write(config_file)

    # Reload the instance
    instance_reload(instance.name)
