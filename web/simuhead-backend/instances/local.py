import os
import shutil
import zipfile
import configparser
from subprocess import Popen, PIPE
from django.conf import settings

RESOURCES_DIR = os.path.join(settings.BASE_DIR, settings.MEDIA_ROOT)
BUILD_SCRIPT = os.path.join(RESOURCES_DIR, 'build', 'build.sh')
POPEN_OPTIONS = {'encoding': 'utf-8', 'stdout': PIPE, 'stderr': PIPE}


# TODO: improve comments
# TODO: detect errors and throw exceptions when possible, better error handling overall
class LocalInstance:
    def __init__(self, name, base_dir=RESOURCES_DIR, script='head.sh'):
        """Abstracts control over local instances
        Instances are identified uniquely by their name

        :param name: the name of the instance
        """
        self.name = name
        self._instance_dir = os.path.join(RESOURCES_DIR, 'instances', self.name)
        # TODO: remove config since it is obsolete
        self._config_path = os.path.join(RESOURCES_DIR, 'instances', self.name, f'{self.name}.ini')
        self._config = None

    def _create_directory(self):
        """Creates the directory structure for the instance if it doesn't exist"""
        if not os.path.exists(self.dir):
            os.makedirs(self.dir)

    @property
    def dir(self):
        """Path to the instance directory"""
        return self._instance_dir

    @property
    def config_path(self):
        return self._config_path

    @property
    def server_dir(self):
        """Path to the instance's server directory"""
        return os.path.join(RESOURCES_DIR, 'instances', self.name, self.revision, 'simutrans')

    @property
    def server_exec(self):
        """Path to the instance's server executable"""
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
        """Pak file name"""
        return self.pak.rsplit('/', 1)[-1]

    @property
    def pak_dir(self):
        """Path to the installed pak directory"""
        return os.path.join(self.server_dir, self.pak_name.rsplit('.', 1)[0])

    @property
    def savegame_name(self):
        """Save file name"""
        return self.savegame.rsplit('/', 1)[-1]

    @property
    def savegame_path(self):
        """Path to the installed save file"""
        return os.path.join(self.server_dir, self.savegame_name)

    @property
    def is_installed(self):
        """Check if all the files are installed"""
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

    # TODO: remove obsolete method
    def status_code(self):
        return self.status

    def remove(self):
        """Remove all the directories and files associated with the instance
        This will not remove any paks or saves
        """
        shutil.rmtree(self.dir, ignore_errors=True)

    def install(self):
        """Copy the right revision to the instance directory and copy the paks and saves"""
        if not os.path.exists(self.server_exec):
            # Check if compilation of the revision is needed
            build_path = self.compile()
            # Copy the right revsion
            shutil.copytree(build_path, os.path.join(self.dir, self.revision))
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
        path = os.path.join(RESOURCES_DIR, 'build', self.revision)
        if not os.path.exists(path):
            with Popen([BUILD_SCRIPT, self.revision], **POPEN_OPTIONS) as proc, \
                    open(os.path.join(RESOURCES_DIR, 'logs', 'build', f'{self.revision}.log'), 'a') as out_log, \
                    open(os.path.join(RESOURCES_DIR, 'logs', 'build', f'{self.revision}_errors.log'), 'a') as err_log:
                out, err = proc.communicate()
                out_log.write(out)
                err_log.write(err)

        return path

    def start(self):
        """Start the server"""
        user = 'greg'
        cmd = f'"{self.server_exec} -server {self.port} -debug {self.debug}' \
              f' -lang {self.lang} -objects {self.pak_name} -load {self.savegame_name}"'

        process = Popen(['sudo', '-H', '-u', user, 'bash', '-c', cmd], **POPEN_OPTIONS)
        out, err = process.communicate()
        if err is None:
            return out
        else:
            raise LocalInstanceError(err)

    def stop(self):
        """Stop the server"""
        pass

    def restart(self):
        """Restart the server"""
        self.stop()
        self.start()

    def reload(self):
        """Stop the server and reinstall pak, saves and new revsion, then restart"""
        self.stop()
        self.install()
        self.start()


class LocalInstanceError(Exception):
    def __init__(self, message):
        self.message = message
