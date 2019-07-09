from django.db import models


class Instance(models.Model):
    name = models.TextField()

    # Instance configuration
    port = models.IntegerField()
    revision = models.IntegerField()
    lang = models.CharField(max_length=2)
