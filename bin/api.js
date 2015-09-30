var fs     = require('fs');
var path   = require('path');
var Hapi   = require('hapi');
var glob   = require('glob');
var assert = require('assert');

var db = require('monk')('localhost/accounting');

var config = JSON.parse(fs.readFileSync(path.join('etc', 'dev.json'), 'utf-8'));

var server = new Hapi.Server();
server.connection({ port: config.port });

// super simple logging (http://stackoverflow.com/users/115493/m01 - http://stackoverflow.com/questions/29746259/how-to-log-all-requests-made-to-a-hapi-server)
server.on('response', function (request) {
    console.log(request.info.remoteAddress + ': ' + request.response.statusCode + ' ' + request.method.toUpperCase() + ' ' + request.url.path );
});

// setup a static directory handler
var setup_static_directory = function(server, config, done) {
  server.register(require('inert'), function (err) {
    console.log("Setting up static directory in " + path.join(__dirname, '..', config.static));
    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
            path: path.join(__dirname, '..', config.static)
        }
      }
    });
    done(err);
  });
};

glob(path.join('lib', 'api*.js'), function(err, api_files) {
  api_files.forEach(function(filename) {
    console.log(`Installing ${filename}`);
    // install the handlers
    require(path.join(__dirname, '..', filename)).setup(server, db);
  });

  // setup the static directory
  setup_static_directory(server, config, function(err) {
    assert.equal(null, err);

    // startup the server
    server.start(function(err) {
      assert.equal(null, err);
      console.log("server started");
    });

  });

});
