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
    process = subprocess.run([f'{HEAD_PATH}/head.sh', '-i', 'instances'], capture_output=True, encoding='utf-8')
    instances_list = process.stdout.split('\n')

    print(instances_list)

    return instances_list


def instance_config(name):
    """
    Returns
    """
    # TODO: check if config is complete
    config = configparser.ConfigParser()
    config.read(f'{HEAD_PATH}/instances/{name}/{name}.conf')
    return config['server']
