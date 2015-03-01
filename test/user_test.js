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

function getUserById (userId) {
  var opts = {
    method: 'GET',
    url: '/users/' + userId
  }

  return Server.injectThen(opts)
}

describe ('Users', function () {
  afterEach(function(done) {
    clearDB(function(err) {
      done()
    })
  })

  it ('Should create user', function (done) {
    var data = {
      email: "test@test.co",
      password: "123",
      name: "test_name"
    }
    response = createUser(data)
    response.then (function (response) {
      var payload = JSON.parse(response.payload)
      response.statusCode.should.equal(201)
      payload.should.have.property("id")
      payload.should.have.property("token")
      payload.should.have.property("email")
      payload.should.have.property("name")
      done()
    })
  })

  it('Should not create user (existing email)', function (done) {
    var data = {
      email: "test@test.co",
      password: "123",
      name: "test_name"
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

  it ('Should get user\'s by userId', function (done) {
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
        
        user = User.findOne({token: payload.token}).exec()
        When(user).then (function (user) {
          response = getUserById(user._id)
          response.then (function (response) {
            response.statusCode.should.equal(200)
            payload = JSON.parse(response.payload)
            payload.email.should.equal(data.email)
            done()
          })
        })
      })
  })

  it('Should login user', function(done) {
    var data = {
      email: "test@test.co",
      password: "123",
      name: "test_name"
    }

    var user = new User(data)
    user.save()
    When(user).then (function(user) { 
      delete data.name
      response = loginUser(data)
      response.then (function (response) {
        var payload = JSON.parse(response.payload)
        response.statusCode.should.equal(202)
        payload.should.have.property("id")
        payload.should.have.property("token")
        payload.should.have.property("email")
        payload.should.have.property("name")

        done()
      })
    })
  })

  it('Should not login user (wrong email)', function(done) {
    var data = {
      email: "wrong@test.co",
      password: "123",
    }

    var user = new User({email: "test@test.co", password: "123"})
    user.save()
    When(user).then (function(user) { 
      response = loginUser(data)
      response.then (function (response) {
        response.statusCode.should.equal(404)
        payload = JSON.parse(response.payload)
        payload.should.have.property("message")
        done()
      })
    })
  })
  
  it('Should not login user (wrong password)', function(done) {
    var data = {
      email: "test@test.co",
      password: "123",
    }

    var user = new User({email: "test@test.co", password: "wrong_password"})
    user.save()
    When(user).then (function(user) { 
      response = loginUser(data)
      response.then (function (response) {
        response.statusCode.should.equal(401)
        payload = JSON.parse(response.payload)
        payload.should.have.property("message")
        done()
      })
    })
  })
})
