(function() {
  var Config, Hapi, Mongoose, Routes, server;

  Hapi = require('hapi');

  Mongoose = require('mongoose');

  Config = require('./config');

  Routes = require('./routes').routes;

  Mongoose.connect(Config.mongoURI);

  server = new Hapi.Server();

  server.connection({
    port: 3000
  });

  server.route(Routes);

  server.start(function() {
    return console.log('Server is running at: ', server.info.uri);
  });

}).call(this);
