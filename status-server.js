#!/usr/bin/env nodejs

const PORT = 8111;

const http = require('http');
const execSync = require('child_process').execSync;

http.createServer(function(request, response) {
  var statuses = [];

  if(request.method == 'GET') {
    // List available intances
    var instances = execSync('ls -1 -- instances/').toString().split('\n');
    var data = [];

    // Check the status and revision of each instance
    for(var i = 0; i < instances.length; i++) {
      var instance = instances[i];
      if(instance) {
        try {
          var instanceStatus = execSync('./simctl.sh statuscode ' + instance).toString();
          var instanceRevision = execSync('./simctl.sh revision ' + instance).toString();
        } catch (error) {
          console.log(error.stdout.toString());
          continue;
        }

        statuses.push({
          'instance': instance.trim(),
          'revision': instanceRevision.trim(),
          'status': instanceStatus
        });
      }
    }

    response.write(JSON.stringify(statuses));
  }
  else {
    response.statusCode = 403;
  }

  response.end();
}).listen(PORT);
