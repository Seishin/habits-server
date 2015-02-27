(function() {
  var Config, Hapi, Mongoose, Routes, server;

  Hapi = require('hapi');

  Mongoose = require('mongoose');

  Config = require('./config');

  Routes = require('./routes').routes;

  Mongoose.connect(Config.mongoURI);

  server = new Hapi.Server();

  server.connection({
    port: process.env.PORT || 8080
  });

  server.register({
    register: require('hapi-swagger', {
      options: {
        swaggerOptions: {
          basePath: 'http://localhost:' + server.info.port,
          apiVersion: 'v1'
        }
      }
    })
  }, function(err) {
    if (err) {
      return console.log(err);
    }
  });

  server.route(Routes);

  server.start(function() {
    return console.log('Server is running at: ', server.info.uri);
  });

  module.exports = server;

}).call(this);
