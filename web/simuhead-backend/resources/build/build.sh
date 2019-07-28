#!/bin/bash
# Build simutrans on a linux server

CORES=$(getconf _NPROCESSORS_ONLN)

REVISION=$1

# Get the script path somewhat reliably (https://stackoverflow.com/a/4774063)
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null

install_dir="${SCRIPTPATH}/../revisions/${REVISION}"

cd $SCRIPTPATH

if [[ ! -e "${install_dir}/sim" ]]; then
  # Download revision and clean
  if [[ -d "trunk" ]]; then
    echo "Updating to r$REVISION..."
    cd trunk
    svn up -r $REVISION

    echo "Running make clean..."
    make clean
  else
    echo "Cloning r$REVISION..."
    svn co --username anon -r $REVISION svn://servers.simutrans.org/simutrans/trunk
    cd trunk
  fi

  # Now inside trunk/
  echo "Building r$REVISION..."
  cp -v ../config.default ./
  make -j${CORES}
  strip build/default/sim

  # Exiting trunk/
  cd ..
else
  # The executable already exists
  echo "Revision ${REVISION} was already compiled!"
fi

# If the compilation was successful
if [[ -e "trunk/build/default/sim" ]]; then
  # Copy the game files
  echo "Copying game files..."
  if [[ ! -d $install_dir ]]; then
    mkdir -p $install_dir
  fi
  cp -vrf trunk/simutrans/ $install_dir
  cp -vf trunk/build/default/sim $install_dir/simutrans/

  # Downloading language files
  echo "Running get_lang_files.sh..."
  cp trunk/get_lang_files.sh $install_dir/
  cd $install_dir/
  ./get_lang_files.sh

  echo "Done installing r${REVISION}!"

# Otherwise the compilation failed
else
  echo "Compilation failed for r${REVISION}. Please read the logs for more information and contact the developer" 1>&2
fi
