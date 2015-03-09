require ('./utils/spec_helper')
var should = require('chai').should()
var expect = require('chai').expect

var When = require('when')
var Models = require('../lib/models')
var UserStats = Models.UserStats
var User = Models.User

function createUser () {
  user = new User()
  user.email = "test@test.co"
  user.password = "123"
  user.token = "random_token"
  
  stats = new UserStats()
  stats.save()

  user.stats = stats
  user.save()
  
  When.all(user, stats).then (function (result) {
    return result[0] 
  })
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
  user = null
  
  beforeEach(function (done) {
    When(createUser()).then (function (result) {
      if (result != null)
        user = result
        done()   
    })
  })

  it ('Should get user\'s privete stats', function (done) {
    request = getUserStats(user.token, user._id)
    request.then (function (response) {
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

  after(function(done) {
    clearDB(function(err) {
      done()
    })
  })
})
