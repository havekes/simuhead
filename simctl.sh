#!/bin/bash
# Launch and manage simutrans servers
# Author: Greg Havekes

USER=simd

LOG_FILE=simctl.log

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
        echo "$level: $data"
        ;;
      WARN)
        echo "$level: $data"
        ;;
      INFO)
        echo "$level: $data"
        ;;
      DEBUG)
        if [[ -z ${VERBOSE+x} ]]; then
          echo "$level: $data"
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
SHORT=v:
LONG=verbose:

# Check if enhanced getopt is available
getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
  echo "Enhanced getopt is not available in this environment"
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
  echo -e "Not enough parmaters."
  usage
  exit 1
fi

# Check instance config
instance_dir=instances/$instance
instance_config=$instance_dir/$instance.conf

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

install_dir=servers/$instance/r$revision/simutrans
pidfile=$instance_dir/$instance.pid
logfile=$instance_dir/$instance.log

# Backup savegames
backup_savegames () {
  if [[ -e $install_dir/server$port-restore.sve ]]; then
    backup_number=`find $install_dir/save/ -maxdepth 1 -type d | wc -l`
    backup_dir=$install_dir/save/backup-$backup_number
    mkdir $backup_dir
    cp $install_dir/server$port-*.sve $backup_dir
  fi
}

# Status of the server process
process_status() {
  # Check if the pid file exists and the process is running
  if [[ -e $pidfile ]]; then
    pid=$(cat $pidfile)
    if kill -0 $pidfile > /dev/null 2>&1; then
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

# Build and install
simutrans_install () {  
  echo "Building simutrans server for revision $revision" | log INFO
  cd build
  ./build.sh $instance $revision | log DEBUG
  cd ..
  simutrans_reload
}


# Show if the server is running
simutrans_status () {
  pid=$(process_status)

  if [[ $pid -gt 1 ]]; then
    echo "Simutrans server instance: $instance running with PID: $pid"
  else
    echo "Simutrans server instance: $instance is not running"
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

# Start an instance
simutrans_start () {
  # Do nothing if already running
  if [[ $(process_status) -gt 1 ]]; then
    echo "Simutrans server instance: $instance already running with PID: $pid"
    exit 0
  fi

  # Check for install
  if [[ ! -d $install_dir ]]; then
    simutrans_install
  fi

  if [[ -e $install_dir/server$port-restore.sve ]]; then
    su $USER -s /bin/sh -c "( $install_dir/sim -server $port -debug $debug -lang $lang -objects $pak 2>&1 & echo \$! >&3 ) 3>$pidfile >> $logfile"
  else
    su $USER -s /bin/sh -c "( $install_dir/sim -server $port -debug $debug -lang $lang -objects $pak -load $save 2>&1 & echo \$! >&3 ) 3>$pidfile >> $logfile"
  fi
}

# Stop an instance
simutrans_stop () {
  pid=$(process_status)
  if [[ $pid -gt 1 ]]; then
    kill $pid
    echo "Simutrans server instance: $instance stopped"
  else
    echo "Simutrans server instance: $instance is already stopped"
  fi
}

# Restart an instance
simutrans_restart() {
  simutrans_stop
  sleep 1
  simutrans_start
}

# Reload paksets, config and savegames
simutrans_reload () {
  backup_savegames

  # Copying paksets
  echo "Extracting pakset..." | log INFO
  unzip -o $instance_dir/pak/*.zip -d $install_dir | log DEBUG

  # Copying config
  echo "Copying config file..." | log INFO
  cp -fv $instance_dir/config/simuconf.tab $install_dir/config/ | log DEBUG

  # Copying savegames
  echo "Copying savegames..." | log INFO
  mkdir build/r$revision/simutrans/save/ | log DEBUG
  cp -fv $instance_dir/save/*.sve $install_dir/save/ | log DEBUG

  simutrans_restart
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
