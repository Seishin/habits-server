require ('./spec_helper')
var should = require('chai').should()
var expect = require('chai').expect

var When = require('when')
var Models = require('../lib/models')
var UserStats = Models.UserStats
var User = Models.User

function createUser (payload) {
  var opts = {
    method: 'POST',
    url: '/users',
    payload: payload
  }

  return Server.injectThen(opts)
}

function getUserStats(token, userId) {
  var opts = {
    method: 'GET',
    url: '/stats/' + userId,
    headers: {authorization: token}
  }

  return Server.injectThen(opts)
}

describe ('UserStats', function() {
  afterEach(function(done) {
    clearDB(function(err) {
      done()
    })
  })

  it ('Should get user\'s stats', function (done) {
    var data = {
      email: 'test@test.co',
      password: '123',
      name: "test_name"
    }

    createUserResponse = createUser(data)
    createUserResponse.then (function (response) {
      response.statusCode.should.equal(201)
      var payload = JSON.parse(response.payload)
      payload.should.have.property('token')

      getStatsResponse = getUserStats(payload.token, payload.id)
      getStatsResponse.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)
        payload.should.have.property("hp")
        payload.should.have.property("exp")
        payload.should.have.property("gold")
        payload.should.have.property("lvl")
        payload.should.have.property("minLvlExp")
        payload.should.have.property("maxLvlExp")
        done()
      })
    })
  })  


})
