# Simutrans server manager

Easy to use script to manage simutrans server intallations and processes.

## Features

- Server instances: each instance has it's own parameters, simuconf.tab, save(s) and pak(s)
- Automatic builds
- Start/stop/restart of instances
- Logging (not quite complete yet)
- Loads save only when first starting the server, then uses the auto saves

## Yet to come

- Announce parameters
- Automated saves backups
- Better logging
- Logs rotation
- RESTful API with server status (for private servers)

## Get Started

- Create an instance with your custom parameters, simuconf.tab, save(s) and pak(s) (use example instance for reference)
- Run `./simctl.sh start <instance>`.

## Usage

### First start

Running `./simctl.sh start <instance>` for the first time will take the following steps:
- Compiling the revision set in the instance's config file (you'll need the usual packages needed to build simutrans, on Debian/Ubuntu you can run `apt-get install build-essential zlib1g-dev libbz2-dev` to get them)
- Extracting your instance's pakset(s) to the installation directory
- Copying your instance's simuconf.tab and save(s) to the installation directory
- Starting your instance loading the save defined in the instance's config

### Start/Stop/Restart

- `./simctl.sh start <instance>` After the first start, it will load the last automatically saved game (this happens when a user connects to the server or when the server is stopped properly)
- `./simctl.sh stop <instance>` Nothing fancy here, only kills the server process
- `./simctl.sh restart <instance>` Same thing as `stop` then `start`

### Reload

If you change an instance's simuconf.tab, pakset, or save, you need to reload the instance, which basically means copying over the new stuff to the installation directory.

To do so, use: `./simctl.sh reload <instance>`

This will make a backup of the last automatically saved game.

### Status

You can check the status of an instance with: `./simctl.sh status <instance>`

You can also check which revision of simutrans a instance is currently using with: `./simctl.sh revision <instance>`
