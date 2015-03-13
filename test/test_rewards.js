require ('./utils/spec_helper')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert 

var When = require('when')
var Moment = require('moment')
var Models = require('../lib/models')
var UserStats = Models.UserStats
var Reward = Models.Rewards

function createUser (done) {
  var user = { 
    email: "test@test.co",
    password: "123",
    name: "Ivan Petrov"
  }
  
  var opts = {
    method: 'POST',
    url: '/users',
    payload: user 
  }

  return Server.injectThen(opts)
}

function createReward(userId, token) {
  var opts = {
    method: 'POST',
    url: '/rewards/?userId=' + userId,
    payload: { text: 'Chocolate', gold: 25 },
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function getReward(userId, rewardId, token) {
  var opts = {
    method: 'GET',
    url: '/rewards/' + rewardId + '/?userId=' + userId,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function getAllRewards(userId, token) {
  var opts = {
    method: 'GET',
    url: '/rewards/all/?userId=' + userId,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function updateReward(userId, rewardId, token, updatedData) {
  var opts = {
    method: 'PUT',
    url: '/rewards/' + rewardId + '/?userId=' + userId,
    payload: updatedData,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function deleteReward(userId, rewardId, token) {
  var opts = {
    method: 'DELETE',
    url: '/rewards/' + rewardId + '/?userId=' + userId,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function buyReward(userId, rewardId, token) {
  var opts = {
    method: 'POST',
    url: '/rewards/buy/' + rewardId + '/?userId=' + userId,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

describe ('Reward', function () {
  user = null
  
  beforeEach(function (done) {
    When(createUser()).then (function (result) {
      if (result != null)
        user = JSON.parse(result.payload) 
        done()   
    })
  })

  it ('Should create a reward', function (done) {
    request = createReward(user._id, user.token)
    request.then (function (response) {
      response.statusCode.should.equal (201)

      payload = JSON.parse(response.payload)
      payload.should.have.property('text')
      payload.should.have.property('user')
      payload.should.have.property('gold')
      
      done()
    })
  })

  it ('Should not create a reward (missing token)', function (done) {
    request = createReward(user._id, null)
    request.then (function (response) {
      response.statusCode.should.equal(401)
      
      done()
    })
  })
  
  it ('Should not create a reward (wrong token)', function (done) {
    request = createReward(user._id, 'wrong_token')
    request.then (function (response) {
      response.statusCode.should.equal(401)

      done()
    })
  })

  describe ('Manipulations', function () {
    reward = null

    beforeEach (function (done) {
      When(createReward(user._id, user.token)).then (function (result) {
        if (result != null)
          reward = JSON.parse(result.payload)
          done()
      })
    })

    it ('Should get a reward', function (done) {
      request = getReward(user._id, reward._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('gold')
        payload.should.have.property('user')

        done()
      })
    })

    it ('Should not get a reward (missing token)', function (done) {
      request = getReward(user._id, reward._id, null)
      request.then (function (response) { 
        response.statusCode.should.equal(401)
        done()
      })
    })
    
    it ('Should not get a reward (wrong token)', function (done) {
      request = getReward(user._id, reward._id, 'wrong_tokne')
      request.then (function (response) { 
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should get all rewards', function (done) {
      request = getAllRewards(user._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('rewards')
        assert.isArray(payload.rewards)
        done()

      })
    })

    it ('Should not get rewards (missing token)', function (done) {
      request = getAllRewards(user._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    }) 

    it ('Should not get all rewards (wrong token)', function (done) {
      request = getAllRewards(user._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should buy reward', function (done) {
      request = buyReward(user._id, reward._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('gold')
        payload.should.have.property('user')

        done()
      }) 
    })

    it ('Should not buy a reward (missing token)', function (done) {
      request = buyReward(user._id, reward._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not buy reward (wrong token)', function (done) {
      request = buyReward(user._id, reward._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })
    
    it ('Should update a reward', function (done) {
      updatedData = {
        text: 'Beer',
        gold: 5
      }

      request = updateReward(user._id, reward._id, user.token, updatedData)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('gold')
        payload.text.should.not.equal(reward.text)
        payload.gold.should.not.equal(reward.gold)

        done()
      })
    })

    it ('Should delete a reward', function (done) {
      request = deleteReward(user._id, reward._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)
        payload.should.have.property('id')

        done()
      })
    })
  })

  after(function(done) {
    clearDB(function(err) {
      done()
    })
  })
})
