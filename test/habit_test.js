require ('./spec_helper')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert 

var When = require('when')
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

function createHabit (payload, headers) {
  var opts = {
    method: 'POST',
    url: '/habits',
    payload: payload,
    headers: headers
  }

  return Server.injectThen (opts)
}

function getHabit (id, headers) {
  var opts = {
    method: 'GET',
    url: '/habits/' + id,
    headers: headers
  }

  return Server.injectThen (opts)
}

function getAllHabit (headers) {
  var opts = {
    method: 'GET',
    url: '/habits/all',
    headers: headers
  }

  return Server.injectThen (opts)
}

function updateHabit (id, payload, headers) {
  var opts = {
    method: 'PUT',
    url: '/habits/' + id,
    headers: headers,
    payload: payload
  }

  return Server.injectThen (opts)
}

function incrementHabit (id, headers) {
  var opts = {
    method: 'POST',
    url: '/habits/increment/' + id,
    headers: headers
  }

  return Server.injectThen (opts)
}

function deleteHabit (id, headers) {
  var opts = {
    method: 'DELETE',
    url: '/habits/' + id,
    headers: headers,
  }

  return Server.injectThen (opts)
}

describe ('Habits', function () {
  it ('Should create habit', function (done) {
    var data = {
      text: "Meditation"
    }

    When(createUser()).then (function (user) {
      response = createHabit(data, {authorization: user.token})
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
      response = createHabit(data, null)
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

    var headers = {
      authorization: "wrong_token"
    }

    When(createUser()).then (function (user) {
      response = createHabit(data, headers)
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        
        getResponse = getAllHabit({authorization: user.token})
        getResponse.then (function (response) {
          var payload = JSON.parse(response.payload)
          response.statusCode.should.equal(200)
          payload.should.have.length(1)
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)
        
        getResponse = getHabit(payload[0]._id, {authorization: user.token})
        getResponse.then (function (response) {
          response.statusCode.should.equal(200)
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)
        
        getResponse = getHabit(payload[0]._id, {authorization: null})
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)
        
        getResponse = getHabit(payload[0]._id, {authorization: "wrong_token"})
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)
        
        var newData = {
          text: "Reading a book"
        }
        getResponse = updateHabit(payload[0]._id, newData, {authorization: user.token})
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        var payload = JSON.parse(response.payload)
        response.statusCode.should.equal(201)
        
        getResponse = deleteHabit(payload[0]._id, {authorization: user.token})
        getResponse.then (function (response) {
          response.statusCode.should.equal(200)
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)

        incResponse = incrementHabit(payload[0]._id, {authorization: user.token})
        incResponse.then (function (response) {
          response.statusCode.should.equal(200)
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)

        incResponse = incrementHabit(payload[0]._id, {authorization: null})
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)

        incResponse = incrementHabit(payload[0]._id, {authorization: "wrong_token"})
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
      createHabitResponse = createHabit(data, {authorization: user.token})
      createHabitResponse.then (function (response) {
        var preUserStats = UserStats.findOne({_id: user.stats}).exec()

        response.statusCode.should.equal(201)
        var payload = JSON.parse(response.payload)
        payload.should.have.length(1)

        incResponse = incrementHabit(payload[0]._id, {authorization: user.token})
        incResponse.then (function (response) {
          response.statusCode.should.equal(200)

          postUserStats = UserStats.findOne({_id: user.stats}).exec()

          When.join(preUserStats, postUserStats).then (function (stats) {
            assert.isAbove(stats[1].exp, stats[0].exp, 'Post exp > pre exp')
            assert.isAbove(stats[1].gold, stats[0].gold, 'Post gold > pre gold')
            assert.isBelow(stats[1].hp, stats[0].hp, 'Post HP == pre HP')
            stats[1].alive.should.equal(true)

            done()
          })
        })
      }) 
    })
  })
})
