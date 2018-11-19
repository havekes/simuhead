# Simuhead

Easy to use script to manage simutrans server intallations and processes.

## Features

- Server instances: each instance has it's own parameters, simuconf.tab, save(s) and pak(s)
- Automatic builds
- Start/stop/restart of instances
- Logging (not fully featured yet)
- Loads save only when first starting the server, then uses the auto saves

## Yet to come

- Announce parameters
- Automated saves backups
- Better logging
- Logs rotation
- RESTful API with server status (for private servers)

## Get Started

### What's an instance

An instance is a specific tree of directories and files that comprises of the following elements:
- A config file specific to the manager
- A simutrans config file (simuconf.tab)
- Pakset(s)
- Save file(s)

The script will take care of conpiling the simutrans server and copying the required files (paks, saves, simuconf.tab).
If you change the config file, you need to run the `reload` comand.
See the Reference section for more details on commands options.

### Base setup

- Create a new user to run your simutrans servers
- Clone this repository in it's home directory
- Create an instance with your custom config, simuconf.tab, save(s) and pak(s) (use the example instance for reference)
- Install required dependencies for compilation. For example, on Ubtunu: 
```
# apt-get install subversion build-essential zlib1g-dev libbz2-dev libsdl2-dev
```
- Run `./simctl.sh start <instance>`.

## Reference

### Start
Command: `simctl.sh start [instance]`

Starts the server and loads the last automatically saved game (this happens when a user connects to the server or when the server is stopped properly).

Running `simctl.sh start [instance]` for a new instance will do the following:
- Compiling the revision set in the instance's config file (you'll need the usual packages needed to build simutrans, on Debian/Ubuntu you can run `apt-get install build-essential zlib1g-dev libbz2-dev` to get them)
- Extracting your instance's pakset(s) to the installation directory
- Copying your instance's simuconf.tab and save(s) to the installation directory
- Starting your instance loading the save file defined in the instance's config

### Stop
Command: `simctl.sh stop [instance]`

Kills the server process.

### Restart

Command: `simctl.sh restart [instance]`

Shortcut for 
```
simctl.sh stop [instance]
simctl.sh start [instance]
```

### Reload

Command: `simctl.sh reload [instance]`

Builds a new excecutable if the revision changed
Copies over the paks, saves and siuconf.tab (will overwrite the old ones if the revision didn't change).
It will also make a backup of the last automatically saved game.

You need to reload an instance if you change an instance's config, simuconf.tab, pakset, or save.


### Status

Command: `simctl.sh status [instance]`

Returns whethers the server process is running or stopped

### Revision

Command: `simctl.sh revision [instance]`

Returns which revision the instance is configured to use

## Software depenencies (for compilation)

- Subversion
- zlib
- bzip2
