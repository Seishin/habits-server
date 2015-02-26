Hapi = require 'hapi'
Mongoose = require 'mongoose'

Config = require './config'
Routes = require('./routes').routes

Mongoose.connect(Config.mongoURI)

server = new Hapi.Server()
server.connection {port: 3000, routes: {cors: true}}

server.register {
  register: require 'hapi-swagger',
  options: swaggerOptions: {
    basePath: 'http://localhost:' + server.info.port,
    apiVersion: 'v1'
  }
}, (err) ->
  if err
    console.log err

server.route Routes

server.start ->
  console.log 'Server is running at: ', server.info.uri

module.exports = server
