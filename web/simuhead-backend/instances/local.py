import os
import shutil
import zipfile
import logging
import configparser
from subprocess import Popen, PIPE
from django.conf import settings

RESOURCES_DIR = os.path.join(settings.BASE_DIR, settings.MEDIA_ROOT)
BUILD_PATH = os.path.join(RESOURCES_DIR, 'build', 'build.sh')

POPEN_OPTIONS = {'encoding': 'utf-8', 'stdout': PIPE, 'stderr': PIPE}


# logger = logging.getLogger(__name__)


# TODO: detect errors and throw exceptions when possible
class LocalInstance:
    def __init__(self, name, base_dir=RESOURCES_DIR, script='head.sh'):
        """Abstracts control over local instances
        Instances are identified uniquely by their name

        :param name: the name of the instance
        """
        self.name = name
        self._script_dir = base_dir
        self._script_path = os.path.join(base_dir, script)
        self._instance_path = os.path.join(RESOURCES_DIR, 'instances', self.name)
        self._config_path = os.path.join(RESOURCES_DIR, 'instances', self.name, f'{self.name}.ini')
        self._config = None

    def _create_directory(self):
        """Creates the directory structure for the instance if it doesn't exist"""
        if not os.path.exists(self.path):
            os.makedirs(self.path)

    @property
    def path(self):
        return self._instance_path

    @property
    def config_path(self):
        return self._config_path

    @property
    def server_dir(self):
        return os.path.join(RESOURCES_DIR, 'instances', self.name, self.revision, 'simutrans')

    @property
    def server_path(self):
        return os.path.join(self.server_dir, 'sim')

    @property
    def config(self):
        """Parse the ini config file when the user needs it"""
        if self._config is None:
            config = configparser.ConfigParser()
            config.read(self._config_path)
            self._config = config
        return self._config['server']

    @config.setter
    def config(self, instance):
        """Converts the model values to ini format and saves to file"""
        config = configparser.ConfigParser()
        config['server'] = {
            'port': instance.port,
            'revision': instance.revision,
            'lang': instance.lang,
            'debug': instance.debug,
        }
        if instance.pak is not None:
            config['server']['pak'] = instance.pak.file.path
        if instance.savegame is not None:
            config['server']['save'] = instance.savegame.file.path

        self._config = config
        # Make sure the directory exists
        self._create_directory()
        # Save to the config file
        with open(self.config_path, 'w') as config_file:
            config.write(config_file)

    @property
    def revision(self):
        return self.config['revision']

    @property
    def port(self):
        return self.config['port']

    @property
    def debug(self):
        return self.config['debug']

    @property
    def lang(self):
        return self.config['lang']

    @property
    def pak(self):
        return self.config['pak']

    @property
    def savegame(self):
        return self.config['save']

    @property
    def pak_name(self):
        return self.pak.rsplit('/', 1)[-1]

    @property
    def pak_dir(self):
        return os.path.join(self.server_dir, self.pak_name.rsplit('.', 1)[0])

    @property
    def savegame_name(self):
        return self.savegame.rsplit('/', 1)[-1]

    @property
    def savegame_path(self):
        return os.path.join(self.server_dir, self.savegame_name)

    @property
    def is_installed(self):
        if not os.path.exists(self.server_dir):
            return False
        elif not os.path.exists(self.pak_dir):
            return False
        elif not os.path.exists(self.savegame_path):
            return False
        else:
            return True

    @property
    def is_running(self):
        return False

    @property
    def status(self):
        """Returns the status code"""
        if self.is_running:
            return 0
        if self.is_installed:
            return 1
        else:
            return 2

    def status_code(self):
        return self.status

    def remove(self):
        """Remove all the directories and files associated with the instance
        This will not remove any paks or saves
        """
        shutil.rmtree(self.path, ignore_errors=True)

    def install(self):
        """Copy the right revision to the instance directory and copy the paks and saves"""
        if not os.path.exists(self.server_path):
            # Check if compilation of the revision is needed
            build_path = self.compile()
            # Copy the right revsion
            shutil.copytree(build_path, os.path.join(self._instance_path, self.revision))
        if not os.path.exists(self.savegame_path):
            # Copy the right savegame
            shutil.copyfile(self.savegame, self.savegame_path)
        if not os.path.exists(self.pak_dir):
            # Unzip the pak
            with zipfile.ZipFile(self.pak, 'r') as zip_ref:
                zip_ref.extractall(self.server_dir)

    def compile(self):
        """Compile the revision for this instance if not previously compiled

        :return: the path to the compiled revision
        """
        path = os.path.join(RESOURCES_DIR, 'revisions', self.revision)
        if not os.path.exists(path):
            with Popen([BUILD_PATH, self.revision], stdout=PIPE, stderr=PIPE) as proc, \
                    open(os.path.join(RESOURCES_DIR, 'logs', 'build', f'{self.revision}.log'), 'ab') as out_log, \
                    open(os.path.join(RESOURCES_DIR, 'logs', 'build', f'{self.revision}_errors.log'), 'ab') as err_log:
                out, err = proc.communicate()
                out_log.write(out)
                err_log.write(err)

        return path

    def start(self):
        """Starts the server"""
        user = 'greg'
        cmd = f'"{self.server_path} -server {self.port} -debug {self.debug}' \
              f' -lang {self.lang} -objects {self.pak_name} -load {self.savegame_name}"'

        process = Popen(['sudo', '-H', '-u', user, 'bash', '-c', cmd], **POPEN_OPTIONS)
        out, err = process.communicate()
        if err is None:
            return out
        else:
            raise LocalInstanceError(err)

    def stop(self):
        """Stops the server"""
        process = Popen([self._script_path, '-i', 'stop', self.name], **POPEN_OPTIONS)
        out, err = process.communicate()
        if err is None:
            return out
        else:
            print(err)
            raise LocalInstanceError(err)

    def restart(self):
        """Restarts the server"""
        self.stop()
        self.start()

    def reload(self):
        """Stop the server and reinstall pak, saves and new revsion, then restart
        This method has to be used when the pak or save are changed
        """
        self.stop()
        self.install()
        self.start()


class LocalInstanceError(Exception):
    def __init__(self, message):
        self.message = message


class LocalInstanceBuildError(LocalInstanceError):
    pass
