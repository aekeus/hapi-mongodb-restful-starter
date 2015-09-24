const assert = require('assert');
const BASE_PATH = "/api/1/accounts";

exports.setup = function(server, db) {

  let accounts = db.get('accounts');

  server.route({
    method: ['GET'],
    path: `${BASE_PATH}/{account?}`,
    handler: function (request, response) {

      let promise = accounts.find();
      promise.on('success', function(docs){
        response(docs);
      });
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
