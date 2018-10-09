#!/bin/bash
# Launch and manage simutrans servers
# Author: Greg Havekes

USER=simd

# Get the script path somewhat reliably (https://stackoverflow.com/a/4774063)
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null

VERBOSE=false

# Log levels : ERROR, WARN, INFO, DEBUG
log() {
  while read data; do
    if [[ $# -ne 1 ]]; then
      level=INFO
    else
      level=$1
    fi

    echo "$level: $data" >> $LOG_FILE

    case $level in
      ERROR)
        echo "$PREFIX | ERROR: $data"
        ;;
      INFO)
        echo "$PREFIX | $data"
        ;;
      DEBUG)
        if [[ $VERBOSE -eq "true" ]]; then
          echo "$PREFIX | DEBUG: $data"
        fi
        ;;
      *)
        echo "ERROR: Unkown log level"
        ;;
      esac
  done
}

# Parameters parsing

usage() {
  echo "Usage : simctl {status|start|stop|restart|reload|statuscode|revision} <instance>"
}

# getopt options
SHORT=v
LONG=verbose

# Check if enhanced getopt is available
getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
  echo "ERROR: Enhanced getopt is not available in this environment"
  exit 1
fi

# -temporarily store output to be able to check for errors
# -activate advanced mode getopt quoting e.g. via “--options”
# -pass arguments only via   -- "$@"   to separate them correctly
PARSED=$(getopt --options $SHORT --longoptions $LONG --name "$0" -- "$@")
if [[ $? -ne 0 ]]; then
  # Then getopt has complained about wrong arguments to stdout
  exit 1
fi
# Use eval with "$PARSED" to properly handle the quoting
eval set -- "$PARSED"

# Handle option arguments
while true; do
  case "$1" in
    -v|--verbose)
      VERBOSE=true
      shift
      ;;
    --)
      shift
      break
      ;;
    *)
      echo "ERROR: Internal error"
      exit 1
      ;;
  esac
done

# Handle non-option arguments
if [[ $# -eq 2 ]]; then
  action=$1
  instance=$2
else
  echo -e "ERROR: Not enough parmaters."
  usage
  exit 1
fi


# Instance config
instance_dir=$SCRIPTPATH/instances/$instance
instance_config=$instance_dir/$instance.conf

# Logs
log_dir=$SCRIPTPATH/log/$instance
if [[ ! -d $log_dir ]]; then
  mkdir $log_dir
fi
LOG_FILE=$log_dir/simctl.log

# Stdout prefix
PREFIX="Simutrans server instance: $instance"


# Check instance config
if [[ -f $instance_config ]]; then
  source $instance_config
else
  echo "There is no config file for instance $instance in $instance_config" | log ERROR
  exit 1
fi

if [[ -z ${revision:+x} ]]; then
  echo "Please set the revision in the instance's config file: $instance_config" | log ERROR
  exit 1
fi

if [[ -z ${port:+x} ]]; then
  echo "Please set the port in the instance's config file: $instance_config" | log ERROR
  exit 1
fi
if [[ -z ${pak:+x} ]]; then
  echo "Please set the pak in the instance's config file: $instance_config" | log ERROR
  exit 1
fi
if [[ -z ${save:+x} ]]; then
  echo "Please set the save in the instance's config file: $instance_config" | log ERROR
  exit 1
fi

if [[ -z ${lang:+x} ]]; then
  echo "Please set the lang in the instance's config file: $instance_config" | log ERROR
  exit 1
fi

if [[ -z ${debug:+x} ]]; then
  # Debug defaults to 2
  debug=2
fi


# Installs
simutrans_dir=$SCRIPTPATH/build/$instance/r$revision/simutrans

# PID files
pidfile=$SCRIPTPATH/run/$instance.pid


# Backup savegames
backup_savegames () {
  if [[ -e $simutrans_dir/server$port-network.sve ]]; then
    backup_number=`find $simutrans_dir/save/ -maxdepth 1 -type d | wc -l`
    backup_dir=$simutrans_dir/save/backup-$backup_number

    mkdir $backup_dir
    mv $simutrans_dir/server$port-*.sve $backup_dir
  fi
}

# Status of the server process
process_status() {
  # Check if the pid file exists and the process is running
  if [[ -e $pidfile ]]; then
    pid=$(cat $pidfile)
    if ps -p $pid > /dev/null
    then
      # Then the server is running
      echo $pid
    else
      # Remove pid file if process crashed
      rm $pidfile
      echo 0
    fi
  else
    # No pid file
    echo 0
  fi
}

# Load paksets, config and savegames
simutrans_load () {
  # Copying paksets
  echo "Extracting pakset..." | log DEBUG
  unzip -o "$instance_dir/pak/*.zip" -d $simutrans_dir | log DEBUG

  # Copying config
  echo "Copying config file..." | log DEBUG
  cp -fv $instance_dir/config/simuconf.tab $simutrans_dir/config/ | log DEBUG

  # Copying savegames
  echo "Copying savegames..." | log DEBUG
  if [[ ! -d $simutrans_dir/save ]]; then
    mkdir $simutrans_dir/save
  fi
  cp -fv $instance_dir/save/*.sve $simutrans_dir/save/ | log DEBUG
}

# Build and install
simutrans_install () {  
  echo "Building r$revision..." | log INFO
  echo "Build log in $log_dir/build-r$revision.log" | log DEBUG
  cd build
  ./build.sh $instance $revision > $log_dir/build-r$revision.log 2>&1
  cd ..

  if [[ -d $simutrans_install ]]; then
    simutrans_reload
  else
    echo "Running with PID: $pid" | log INFO
  fi

  simutrans_load
}


simutrans_status () {
  pid=$(process_status)

  if [[ $pid -gt 1 ]]; then
    echo "Running with PID: $pid" | log INFO
  else
    echo "Not running" | log INFO
  fi
}

simutrans_status_code () {
  pid=$(process_status)

  if [[ $pid -gt 1 ]]; then
    echo 1
  else
    echo 0
  fi
}

simutrans_start () {
  # Do nothing if already running
  if [[ $(process_status) -gt 1 ]]; then
    echo "Already running with PID: $pid"
    exit 0
  fi

  # Check for install
  if [[ ! -d $simutrans_dir ]]; then
    simutrans_install
  fi

  echo "Starting server..." | log INFO

  # Restore the game if possible, otherwise load provided savegame
  if [[ -e $simutrans_dir/server$port-network.sve ]]; then
    ( $simutrans_dir/sim -server $port -debug $debug -lang $lang -objects $pak 2>&1 & echo $! > $pidfile ) >> $log_dir/sim.log
    echo "Using command: $simutrans_dir/sim -server $port -debug $debug -lang $lang -objects $pak" | log DEBUG
  else
    ( $simutrans_dir/sim -server $port -debug $debug -lang $lang -objects $pak -load $save 2>&1 & echo $! > $pidfile ) >> $log_dir/sim.log
    echo "Using command: $simutrans_dir/sim -server $port -debug $debug -lang $lang -objects $pak -load $save" | log DEBUG
  fi
}

simutrans_stop () {
  pid=$(process_status)
  if [[ $pid -gt 1 ]]; then
    kill $pid
    rm $pidfile
    echo "Server stopped PID: $pid" | log INFO
  else
    echo "Already stopped" | log INFO
  fi
}

simutrans_restart() {
  simutrans_stop
  sleep 1
  simutrans_start
}

simutrans_reload() {
  simutrans_stop

  # Backup the saves
  backup_savegames

  # Check if we need to build a new revision
  if [[ ! -d $simutrans_dir ]]; then
    simutrans_install
  fi

  simutrans_load
  simutrans_start
}

# Action switching
case $action in
  status)
    simutrans_status
    ;;
  start)
    simutrans_start
    ;;
  stop)
    simutrans_stop
    ;;
  restart)
    simutrans_restart
    ;;
  reload)
    simutrans_reload
    ;;
  statuscode)
    simutrans_status_code
    ;;
  revision)
    echo $revision;
    ;;
  *)
    echo "Action $action does not exist."
    usage
    exit 1
    ;;
esac
