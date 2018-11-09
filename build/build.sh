#!/bin/bash
# Build simutrans on a linux server

CORES=$(getconf _NPROCESSORS_ONLN)

INSTANCE=$1
REVISION=$2

# Get the script path somewhat reliably (https://stackoverflow.com/a/4774063)
pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null

install_dir=$SCRIPTPATH/$INSTANCE/r$REVISION

if [[ ! -e "${install_dir}/sim" ]]; then
  if [[ $REVISION -ne $(cat last_build.revision) ]]; then
    # Download revision and clean
    if [[ -d "trunk" ]]; then
      echo "Updating to r$REVISION..."
      cd trunk
      svn up -r $REVISION
      make clean
    else
      "Cloning r$REVISION..."
      svn co --username anon -r $REVISION svn://servers.simutrans.org/simutrans/trunk
      cd trunk
    fi
  fi

  # Now inside trunk/
  echo "Building r$REVISION..."
  cp ../config.default ./
  make -j$CORES
  strip build/default/sim

  # Exiting trunk/
  cd ..

  # Save last revision
  echo $REVISION > last_build.revision
fi

# Copy the game files
echo "Copying game files..."
if [[ ! -d $install_dir ]]; then
  mkdir -p $install_dir
fi
cp -rf trunk/simutrans/ $install_dir
cp -f trunk/build/default/sim $install_dir/simutrans/

# Downloading language files
echo "Running get_lang_files.sh..."
cp trunk/get_lang_files.sh $install_dir/
cd $install_dir/
./get_lang_files.sh

echo "Done installing r$REVISION!"
