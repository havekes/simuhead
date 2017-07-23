#!/bin/bash
# Build simutrans on a linux server

INSTANCE=$1
REVISION=$2
install_dir=../servers/$INSTANCE/r$REVISION

if [[ $REVISION -nq $(cat last_build.revision) ]]; then
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

  # Now inside trunk/
  echo "Building r$REVISION..."
  cp ../config.default ./
  make
  strip build/default/sim

  # Exiting trunk/
  cd ..
fi

# Copy the game files
echo "Copying game files..."
if [[ ! -d $install_dir ]]
  mkdir $install_dir
fi
cp -rf trunk/simutrans/ $install_dir
cp -f trunk/build/default/sim $install_dir/simutrans/

# Downloading language files
echo "Running get_lang_files.sh..."
cp trunk/get_lang_files.sh $install_dir/simutrans/text/
cd $install_dir/simutrans/text/
./get_lang_files.sh
cd ../../../

# Save last revision
echo $REVISION > last_build.revision

echo "Done installing r$REVISION!"
