from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class ExternalFile(models.Model):
    name = models.TextField()
    version = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


def pak_file_path(pak, filename):
    return f'paks/{pak.name}-{pak.version}.zip'


class Pak(ExternalFile):
    file = models.FileField(upload_to=pak_file_path)


def save_file_path(save, filename):
    return f'saves/{save.name}-{save.version}.sve'


class Save(ExternalFile):
    file = models.FileField(upload_to=save_file_path)


class Revision(models.Model):
    r = models.IntegerField()
    alias = models.TextField()
    compiled = models.BooleanField(default=False)


class Instance(models.Model):
    name = models.TextField(unique=True)

    # Instance configuration
    port = models.IntegerField(default=13353, unique=True)
    revision = models.ForeignKey(Revision, on_delete=models.PROTECT, null=True)
    lang = models.CharField(max_length=2, default='en')
    debug = models.IntegerField(default=2, validators=[MinValueValidator(1), MaxValueValidator(3)])

    pak = models.ForeignKey(Pak, on_delete=models.PROTECT, null=True)
    savegame = models.ForeignKey(Save, on_delete=models.PROTECT, null=True)
