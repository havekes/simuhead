import os
import subprocess
import configparser
from pathlib import Path

HEAD_PATH = Path(os.path.abspath(__file__)).parents[3]


def instances():
    """
    Runs head.sh -i instances

    Returns a list of names of available instances
    """
    process = subprocess.run([f'{HEAD_PATH}/head.sh', '-i', 'instances'],
                             capture_output=True, encoding='utf-8')
    instances_list = process.stdout.split('\n')

    return instances_list


def instance_create_dir(name):
    instance_path = os.path.join(HEAD_PATH, 'instances', name)
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)


# TODO: move out of run since it doesn't use any system commands
def instance_config(name):
    """
    Returns the configuration of a server
    """
    # TODO: check if config is complete
    config = configparser.ConfigParser()
    config.read(instance_config_path(name))
    return config['server']


def instance_config_path(name):
    return os.path.join(HEAD_PATH, 'instances', name, f'{name}.conf')


def instance_status_code(name):
    """
    Runs head.sh -i statuscode [name]

    Returns the status code number
    """
    status_process = subprocess.run([f'{HEAD_PATH}/head.sh', 'statuscode', name],
                                    capture_output=True, encoding='utf-8')
    status_code = status_process.stdout

    print(status_code)

    return status_code


def instance_start(name):
    """
    Runs head.sh -i start [name]

    Returns a status code
    """
    subprocess.run([f'{HEAD_PATH}/head.sh', 'i', 'start', name], encoding='utf-8')
    return instance_status_code(name)


def instance_stop(name):
    """
    Runs head.sh -i stop [name]
    """
    subprocess.run([f'{HEAD_PATH}/head.sh', 'i', 'stop', name], encoding='utf-8')
    return instance_status_code(name)


def instance_restart(name):
    """
    Runs head.sh -i restart [name]
    """


def instance_reload(name):
    """
    Runs head.sh -i reload [name]
    """
