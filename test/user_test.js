require ('./spec_helper')
var should = require('chai').should()
var expect = require('chai').expect

var When = require('when')
var User = require('../lib/models').User

function createUser (payload) {
  var opts = {
    method: 'POST',
    url: '/users',
    payload: payload
  }

  return Server.injectThen(opts)
}

function loginUser (payload) {
  var opts = {
    method: 'POST',
    url: '/users/login',
    payload: payload
  }

  return Server.injectThen(opts)
}

describe ('Users', function () {
  it ('Should create user', function (done) {
    var data = {
      email: "test@test.co",
      password: "123"
    }
    response = createUser(data)
    response.then (function (response) {
      var payload = JSON.parse(response.payload)
      response.statusCode.should.equal(201)
      payload.should.have.property("token")
      done()
    })
  })

  it('Should not create user (existing email)', function (done) {
    var data = {
      email: "test@test.co",
      password: "123"
    }
    response_1 = createUser(data)
    response_1.then (function (response) {
      var payload = JSON.parse(response.payload)
      response.statusCode.should.equal(201)
      payload.should.have.property("token")

      response_2 = createUser(data)
      response_2.then (function (response) {
        response.statusCode.should.equal(417)
        done()
      })
    })
  })

  it('Should login user', function(done) {
    var data = {
      email: "test@test.co",
      password: "123"
    }

    var user = new User(data)
    user.save()
    When(user).then (function(user) { 
      response = loginUser(data)
      response.then (function (response) {
        var payload = JSON.parse(response.payload)
        response.statusCode.should.equal(202)
        payload.should.have.property("token")
        done()
      })
    })
  })

  it('Should not login user (wrong email)', function(done) {
    var data = {
      email: "wrong@test.co",
      password: "123"
    }

    var user = new User({email: "test@test.co", password: "123"})
    user.save()
    When(user).then (function(user) { 
      response = loginUser(data)
      response.then (function (response) {
        response.statusCode.should.equal(404)
        done()
      })
    })
  })
  
  it('Should not login user (wrong password)', function(done) {
    var data = {
      email: "test@test.co",
      password: "123"
    }

    var user = new User({email: "test@test.co", password: "wrong_password"})
    user.save()
    When(user).then (function(user) { 
      response = loginUser(data)
      response.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })
  })


})
