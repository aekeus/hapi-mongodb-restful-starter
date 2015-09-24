'use strict';

var assert = require('assert');
var BASE_PATH = "/api/1/accounts";

// PUT adds or updates an item at a known URL
// POST creates of updates an item in a known collection

exports.setup = function (server, db) {

  var accounts = db.get('accounts');

  server.route({
    method: ['GET'],
    path: BASE_PATH + '/{account?}',
    handler: function handler(request, response) {
      if (request.params.account === undefined) {
        accounts.find({}, function (err, docs) {
          return response(docs);
        });
      } else {
        accounts.findById(request.params.account, function (err, docs) {
          return response(docs);
        });
      }
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
