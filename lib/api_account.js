'use strict';

var assert = require('assert');
var BASE_PATH = "/api/1/accounts";

exports.setup = function (server, db) {

  var accounts = db.get('accounts');

  server.route({
    method: ['GET'],
    path: BASE_PATH + '/{account?}',
    handler: function handler(request, response) {

      var promise = accounts.find();
      promise.on('success', function (docs) {
        response(docs);
      });
    }
  });

  server.route({
    method: ['PUT'],
    path: BASE_PATH + '/{account?}',
    handler: function handler(req, response) {
      accounts.insert(req.payload, function (err, doc) {
        assert.equal(null, err);
        response(doc);
      });
    }
  });
};
