"use strict";

exports.setup = function (server) {

  server.route({
    method: ['GET'],
    path: "/api/1/accounts/{account?}",
    handler: function handler(request, response) {
      response("{}");
    }
  });
};
