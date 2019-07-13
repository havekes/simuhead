import configparser
import os
import shutil
import subprocess
from pathlib import Path

HEAD_DIR = Path(os.path.abspath(__file__)).parents[3]
HEAD_PATH = os.path.join(HEAD_DIR, 'head.sh')
RESOURCES_DIR = os.path.join(HEAD_DIR, 'resources')


# TODO: detect errors and throw exceptions when possible
class LocalInstance:
    def __init__(self, name):
        """Abstracts control over local instances
        Instances are identified uniquely by their name

        :param name: the name of the instance
        """
        self.name = name
        self._path = os.path.join(HEAD_DIR, 'instances', self.name)
        self._config_path = os.path.join(HEAD_DIR, 'instances', self.name, f'{self.name}.conf')
        self._config = None

    @property
    def path(self):
        return self._path

    @property
    def config_path(self):
        return self._config_path

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
        }
        self._config = config
        # Make sure the directory exists
        self._create_directory()
        # Save to the config file
        with open(self.config_path, 'w') as config_file:
            config.write(config_file)
        # Reload the instance
        self.reload()

    def _create_directory(self):
        """Creates the directory structure for the instance if it doesn't exist"""
        if not os.path.exists(self.path):
            os.makedirs(self.path)

    def remove(self):
        """Remove all the directories and files associated with the instance"""
        shutil.rmtree(self.path, ignore_errors=True)

    def status_code(self):
        """Returns the status code"""
        subprocess.run([HEAD_PATH, 'i', 'statuscode', self.name], encoding='utf-8')

    def start(self):
        """Starts the server"""
        subprocess.run([HEAD_PATH, 'i', 'start', self.name], encoding='utf-8')

    def stop(self):
        """Stops the server"""
        subprocess.run([HEAD_PATH, 'i', 'stop', self.name], encoding='utf-8')

    def restart(self):
        """Restarts the server"""
        subprocess.run([HEAD_PATH, 'i', 'restart', self.name], encoding='utf-8')

    def reload(self):
        """Reloads the configuration for this server.
        This method has to be used in case the pak or save are changed
        """
        subprocess.run([HEAD_PATH, 'i', 'reload', self.name], encoding='utf-8')
