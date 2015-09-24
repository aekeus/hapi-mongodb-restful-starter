const assert = require('assert');
const BASE_PATH = "/api/1/accounts";

// PUT adds or updates an item at a known URL
// POST creates of updates an item in a known collection

exports.setup = function(server, db) {

  let accounts = db.get('accounts');

  server.route({
    method: ['GET'],
    path: `${BASE_PATH}/{account?}`,
    handler: function (request, response) {
      if(request.params.account === undefined) {
        accounts.find({}, (err, docs) => response(docs));
      } else {
        accounts.findById(request.params.account, (err, docs) => response(docs));
      }
    }
  });

  server.route({
    method: ['PUT'],
    path: `${BASE_PATH}/{account?}`,
    handler: function (req, response) {
      accounts.insert(req.payload, function(err, doc) {
        assert.equal(null, err);
        response(doc);
      });
    }
  });

};
