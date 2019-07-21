import os
import shutil
from django.db.models import ProtectedError
from django.test import TestCase, override_settings, SimpleTestCase
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Pak, Save, Instance
from .local import LocalInstance


class InstanceTests(TestCase):
    def test_create_with_null_pak_save(self):
        instance = Instance.objects.create(name='Test', port=1, revision=1, pak=None, save=None)


@override_settings(MEDIA_ROOT='test/resources')
class InstanceRelationsTests(TestCase):
    def setUp(self):
        pak_file = SimpleUploadedFile(os.path.join(settings.MEDIA_ROOT, 'paks/test.pak'), content=b'')
        save_file = SimpleUploadedFile(os.path.join(settings.MEDIA_ROOT, 'saves/test.sve'), content=b'')

        self.pak = Pak.objects.create(name='TestPak', version='1.0.0', file=pak_file)
        self.savegame = Save.objects.create(name='TestSave', version='1.0.0', file=save_file)

        self.instance = Instance.objects.create(name='TestInstance', port=1, revision=1,
                                                pak=self.pak, savegame=self.savegame)

    def tearDown(self):
        shutil.rmtree('test')

    def test_delete_pak(self):
        with self.assertRaises(ProtectedError):
            self.pak.delete()

    def test_delete_save(self):
        with self.assertRaises(ProtectedError):
            self.savegame.delete()


class LocalInstanceTests(SimpleTestCase):
    def setUp(self):
        self.name = 'test'
        self.base_dir = 'test/instances'
        self.instance = LocalInstance(name=self.name, base_dir=self.base_dir)

    def tearDown(self):
        pass
        #shutil.rmtree('test')

    def check_directory_created(self):
        return os.path.exists(self.instance._path)

    def test_create_directory_readonly(self):
        # Make instances directory read only
        os.makedirs(self.base_dir, 0o444)
        self.instance._create_directory()

        self.assertFalse(self.check_directory_created())
