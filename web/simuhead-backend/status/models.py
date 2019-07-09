from django.db import models

DEFAULT_CONFIG = """[server]
port=13353
revision=4321
pak=pak128
save=example.sve
lang=en
"""


class Instance(models.Model):
    name = models.TextField()

    # Instance configuration
    port = models.IntegerField()
    revision = models.IntegerField()
    lang = models.CharField(max_length=2)
