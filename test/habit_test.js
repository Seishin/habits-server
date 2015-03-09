require ('./spec_helper')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert 

var When = require('when')
var Moment = require('moment')
var Models = require('../lib/models')
var User = Models.User
var Habit = Models.Habit
var UserStats = Models.UserStats

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

function createHabit (userId, token) {
  var opts = {
    method: 'POST',
    url: '/habits/?userId=' + userId,
    payload: { text: 'Meditation 30 min' },
    headers: {authorization: token } 
  }

  return Server.injectThen (opts)
}

function getHabit (userId, habitId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'GET',
    url: '/habits/' + habitId + '/?userId=' + userId + '&date=' + date,
    headers: {authorization: token } 
  }

  return Server.injectThen (opts)
}

function getAllHabits (userId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'GET',
    url: '/habits/all/?userId=' + userId + '&date=' + date,
    headers: {authorization: token } 
  }

  return Server.injectThen (opts)
}

function updateHabit (userId, habitId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'PUT',
    url: '/habits/' + habitId + '/?userId=' + userId + '&date=' + date,
    headers: { authorization: token },
    payload: { text: 'Reading a book 1h' } 
  }

  return Server.injectThen (opts)
}

function incrementHabit (userId, habitId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/habits/increment/' + habitId + '/?userId=' + userId + '&date=' + date,
    headers: {authorization: token } 
  }

  return Server.injectThen (opts)
}

function deleteHabit (userId, habitId, token) {
  var opts = {
    method: 'DELETE',
    url: '/habits/' + habitId + '/?userId=' + userId,
    headers: {authorization: token },
  }

  return Server.injectThen (opts)
}

describe ('Habits', function () {
  user = null
  taskId = null
  
  beforeEach(function (done) {
    When(createUser()).then (function (result) {
      if (result != null)
        user = result
        done()   
    })
  })
  
  it ('Should create habit', function (done) {
    request = createHabit(user._id, user.token)
    request.then (function (response) {
      response.statusCode.should.equal(201)
      payload = JSON.parse(response.payload)
      payload.should.have.property('text')
      payload.should.have.property('state')
      done()
    })
  })
  
  it ('Should not create habit (missing token)', function (done) {
    request = createHabit(user._id, null)
    request.then (function (response) {
      response.statusCode.should.equal(401)
      done()
    }) 
  })

  it ('Should not create habit (wrong token)', function (done) {
    request = createHabit(user._id, 'wrong_token')
    request.then (function (response) {
      response.statusCode.should.equal(401)
      done()
    }) 
  })

  describe ('Manipulations', function () {
    habit = null

    beforeEach (function (done) {
      request = createHabit(user._id, user.token)
      request.then (function (response) {
        if (response != null)
          habit = JSON.parse(response.payload)
          done()
      })
    })

    it ('Should get all habits', function (done) {
      request = getAllHabits(user._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property("habits")
        assert(Array.isArray(payload.habits), 'habits property is an array')
        assert.isAbove(payload.habits.length, 0, 'habits array lenght must be > 1')
        done() 
      })
    })

    it ('Should get habit', function (done) {
      request = getHabit(user._id, habit._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)
        
        response.statusCode.should.equal(200)
        payload.should.have.property("text")
        payload.should.have.property("state")
        payload.state.should.equal(0)
        done()
      }) 
    })

    it ('Should not get habit (missing token)', function (done) {
      request = getHabit(user._id, habit._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not get habit (wrong token)', function (done) {
      request = getHabit(user._id, habit._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should update habit', function (done) {
      request = updateHabit(user._id, habit._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('text')
        payload.should.have.property('state')
        done()
      })
    })

    it ('Should delete habit', function (done) {
      request = deleteHabit(user._id, habit._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)

        payload.should.have.property("id")
        done()
      })
    })

    it ('Should increment habit', function (done) {
      request = incrementHabit(user._id, habit._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)
        
        response.statusCode.should.equal(200)
        payload.should.have.property('text')
        payload.should.have.property('state')
        payload.state.should.equal(0)

        done()
      })
    }) 
    
    it ('Should not increment habit (missing token)', function (done) {
      request = incrementHabit(user._id, habit._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    }) 

    it ('Should not increment habit (wrong token)', function (done) {
      request = incrementHabit(user._id, habit._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should increment and update user stats', function (done) {
      preUserStats = UserStats.findOne({_id: user.stats}).exec()
      
      request = incrementHabit(user._id, habit._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        postUserStats = UserStats.findOne({_id: user.stats}).exec()

        When.join(preUserStats, postUserStats).then (function (stats) {
          assert.isAbove(stats[1].exp, stats[0].exp, 'Post exp > pre exp')
          assert.isAbove(stats[1].gold, stats[0].gold, 'Post gold > pre gold')
          assert.equal(stats[1].hp, stats[0].hp, 'Post HP == pre HP')
          stats[1].alive.should.equal(true)

          done()
        })
      })
    }) 
  })

  after(function(done) {
    clearDB(function(err) {
      done()
    })
  })
})
