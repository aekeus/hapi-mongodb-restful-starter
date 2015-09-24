var fs   = require('fs');
var path = require('path');
var Hapi = require('hapi');
var glob = require('glob');
var assert = require('assert');

var config = JSON.parse(fs.readFileSync(path.join('etc', 'dev.json'), 'utf-8'));

console.log(config);

var server = new Hapi.Server();
server.connection({ port: config.port });

glob(path.join('lib', 'api*.js'), function(err, api_files) {
  console.log(api_files);
  api_files.forEach(function(filename) {
    console.log(filename);
    // install the handlers
    require(path.join(__dirname, '..', filename)).setup(server);
  });

  server.start(function(err) {
    assert.equal(null, err);
    console.log("server started");
  });

});
