const assert = require('assert');
const BASE_PATH = "/api/1/accounts";
const Joi = require('joi');

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
    method: ['PUT', 'POST'],
    path: `${BASE_PATH}/{account?}`,
    handler: function (req, response) {
      if (req.params.account) {
        accounts.updateById(req.payload._id, req.payload, function(err, doc) {
          assert.equal(null, err);
          response(req.payload);
        });
      } else {
        accounts.insert(req.payload, function(err, doc) {
          assert.equal(null, err);
          response(doc);
        });
      }
    },
    config: {
      validate: {
        params: {
          account: Joi.string().min(3).max(24)
        },
        payload: {
          name: Joi.string().min(3).max(50)
        }
      }
    }
  });

};
