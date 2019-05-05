Simuhead
========

Easy to use script to manage simutrans server intallations and processes.


Features
--------

- Server instances: each instance has it's own parameters, simuconf.tab, save(s) and pak(s)
- Automatic builds
- Start/stop/restart of instances
- Logging (not fully featured yet)
- Loads save only when first starting the server, then uses the auto saves


Yet to come
-----------

- Announce parameters
- Automated saves backups
- Better logging
- RESTful API with server status


Get Started
-----------

### What's an instance

An instance is a specific tree of directories and files that comprises of the following elements:
- A config file to setup the script
- A simutrans config file (simuconf.tab)
- Pakset(s)
- Save file(s)

The script will take care of conpiling the simutrans server and copying the required files (paks, saves, simuconf.tab).
If you change the config file, you just need to run the `reload` comand.
See the *Reference* section for more details on commands options.


### Base setup

- Create a new user to run your simutrans servers
- Clone the simuhead repository in the user's home directory
- Create an instance with your custom config, simuconf.tab, save(s) and pak(s) (use the *example* instance for reference)
- Install required dependencies for compiling simutrans (see the *Software depenencies* section)
- Start your instance:

```# ./head.sh start <instance>```

You should now read the *Reference* section for a more in depth look at each available command.


Reference
---------

**All commands must be executed as root**


### Start

Command: `head.sh start [instance]`

Starts the server and loads the last automatically saved game (this happens when a user connects to the server or when the server is stopped properly).

Running `head.sh start [instance]` for a new instance will do the following:
- Compiling the revision set in the instance's config file (you'll need the usual packages needed to build simutrans, on Debian/Ubuntu you can run `apt-get install build-essential zlib1g-dev libbz2-dev` to get them)
- Extracting your instance's pakset(s) to the installation directory
- Copying your instance's simuconf.tab and save(s) to the installation directory
- Starting your instance loading the save file defined in the instance's config


### Stop

Command: `head.sh stop [instance]`

Kills the server process.
The last autosave will be loaded on restart (an autosave is created when a player joins).


### Restart

Command: `head.sh restart [instance]`

Shortcut for 
```
simctl.sh stop [instance]
simctl.sh start [instance]
```


### Reload

Command: `head.sh reload [instance]`

Builds a new excecutable if the revision changed.

Copies over the paks, saves and simuconf.tab (will overwrite the old ones if the revision didn't change).
It will also make a backup of the last automatically saved game.

You need to reload an instance if you change an instance's config, simuconf.tab, pakset, or save.


### Status

Command: `head.sh status [instance]`

Returns whethers the instance's server process is running or stopped.


### Revision

Command: `head.sh revision [instance]`

Returns which revision the instance is using.


### `head.conf`: global configuration

Global settings that modify the script's behaviour

- USER: user that will be running simutrans processes (highly recomended to be a fresh user, with permissions limited to this directory)
- VERBOSE: `true` will display more debuging information, `false` less
- ROOTDIR: path to the simuhead directory. The default is fine if you follow the *Get started* instructions.


Depenencies
-----------

These dependencies are needed to compile simutrans:

- Subversion
- zlib
- bzip2

To install them, look for instructions specific to your OS/distribution.

For example, on Debian/Ubtunu you can run:

``` # apt-get install build-essential subversion zlib1g-dev libbz2-dev ```