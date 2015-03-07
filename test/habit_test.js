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
  var user = new User()
  user.email = "test@test.co"
  user.password = "123"
  user.token = "random_token"
  
  var stats = new UserStats()
  stats.save()

  user.stats = stats
  user.save()

  return user
}

function createHabit (userId, payload, token) {
  var opts = {
    method: 'POST',
    url: '/habits/?userId=' + userId,
    payload: payload,
    headers: {authorization: token} 
  }

  return Server.injectThen (opts)
}

function getHabit (userId, habitId, token) {
  var opts = {
    method: 'GET',
    url: '/habits/' + habitId + '/?userId=' + userId,
    headers: {authorization: token} 
  }

  return Server.injectThen (opts)
}

function getAllHabit (userId, date, token) {
  var opts = {
    method: 'GET',
    url: '/habits/all/?userId=' + userId + '&date=' + date,
    headers: {authorization: token} 
  }

  return Server.injectThen (opts)
}

function updateHabit (userId, habitId, payload, token) {
  var opts = {
    method: 'PUT',
    url: '/habits/' + habitId + '/?userId=' + userId,
    headers: {authorization: token},
    payload: payload
  }

  return Server.injectThen (opts)
}

function incrementHabit (userId, habitId, date, token) {
  var opts = {
    method: 'POST',
    url: '/habits/increment/' + habitId + '/?userId=' + userId + '&date=' + date,
    headers: {authorization: token} 
  }

  return Server.injectThen (opts)
}

function deleteHabit (userId, habitId, token) {
  var opts = {
    method: 'DELETE',
    url: '/habits/' + habitId + '/?userId=' + userId,
    headers: {authorization: token},
  }

  return Server.injectThen (opts)
}

describe ('Habits', function () {
  it ('Should create habit', function (done) {
    var data = {
      text: "Meditation"
    }

    When(createUser()).then (function (user) {
      response = createHabit(user._id, data, user.token)
      response.then (function (response) {
        response.statusCode.should.equal(201)
        done()
      })
    })
  })

  it ('Should not create habit (missing token)', function (done) {
    var data = {
      text: "Meditation"
    }

    When(createUser()).then (function (user) {
      response = createHabit(user._id, data, null)
      response.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      }) 
    })
  })

  it ('Should not create habit (wrong token)', function (done) {
    var data = {
      text: "Meditation"
    }

    When(createUser()).then (function (user) {
      response = createHabit(user._id, data, "wrong_token")
      response.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      }) 
    })
  })

  it ('Should get all habits', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        
        date = Moment(new Date()).format('YYYY-MM-DD')

        getResponse = getAllHabit(user._id, date, user.token)
        getResponse.then (function (response) {
          var payload = JSON.parse(response.payload)
          response.statusCode.should.equal(200)
          payload.should.have.property("habits")

          done() 
        })
      }) 
    })
  })

  it ('Should get habit', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        payload = JSON.parse(response.payload)
        
        getResponse = getHabit(user._id, payload._id, user.token)
        getResponse.then (function (response) {
          response.statusCode.should.equal(200)
          payload = JSON.parse(response.payload)
          payload.should.have.property("text")
          payload.text.should.equal(data.text)
          
          payload.should.have.property("state")
          payload.state.should.equal(0)
          done()
        })
      }) 
    })
  })

  it ('Should not get habit (missing token)', function (done) {
      var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        payload = JSON.parse(response.payload)
        
        getResponse = getHabit(user._id, payload._id, null)
        getResponse.then (function (response) {
          response.statusCode.should.equal(401)
          done()
        })
      }) 
    })
  })

  it ('Should not get habit (wrong token)', function (done) {
      var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        
        getResponse = getHabit(user._id, payload._id, 'wrong_token')
        getResponse.then (function (response) {
          response.statusCode.should.equal(401)
          done()
        })
      }) 
    })
  })

  it ('Should update habit', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        
        var newData = {
          text: "Reading a book",
          state: 0
        }
        getResponse = updateHabit(payload.user, payload._id, newData, user.token)
        getResponse.then (function (response) {
          var payload = JSON.parse(response.payload)
          response.statusCode.should.equal(200)
          payload.should.have.property("text")
          payload.text.should.equal(newData.text)
          done()
        })
      }) 
    })
  })

  it ('Should delete habit', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        var payload = JSON.parse(response.payload)
        response.statusCode.should.equal(201)
        
        getResponse = deleteHabit(payload.user, payload._id, user.token)
        getResponse.then (function (response) {
          response.statusCode.should.equal(200)
          payload = JSON.parse(response.payload)

          payload.should.have.property("id")
          done()
        })
      }) 
    })
  })

  it ('Should increment habit', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)

        date = Moment(new Date()).format('YYYY-MM-DD')

        incResponse = incrementHabit(user._id, payload._id, date, user.token)
        incResponse.then (function (response) {
          response.statusCode.should.equal(200)
          payload = JSON.parse(response.payload)
          payload.should.have.property("text")
          payload.text.should.equal(data.text)
          
          payload.should.have.property("state")
          payload.state.should.equal(0)

          done()
        })
      }) 
    })
  })
  
  it ('Should not increment habit (missing token)', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)

        incResponse = incrementHabit(payload.user, payload._id, null)
        incResponse.then (function (response) {
          response.statusCode.should.equal(401)
          done()
        })
      }) 
    })
  })

  it ('Should not increment habit (wrong token)', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)

        incResponse = incrementHabit(payload.user, payload._id, "wrong_token")
        incResponse.then (function (response) {
          response.statusCode.should.equal(401)
          done()
        })
      }) 
    })
  })

  it ('Should increment and update user stats', function (done) {
    var data = {
      text: "Meditation"
    } 

    When(createUser()).then (function (user) {
      createHabitResponse = createHabit(user._id, data, user.token)
      createHabitResponse.then (function (response) {
        var preUserStats = UserStats.findOne({_id: user.stats}).exec()

        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)

        date = Moment(new Date()).format('YYYY-MM-DD')

        incResponse = incrementHabit(user._id, payload._id, date, user.token)
        incResponse.then (function (response) {
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
  })
})
