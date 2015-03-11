require ('./utils/spec_helper')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert 

var When = require('when')
var Moment = require('moment')
var Models = require('../lib/models')
var User = Models.User
var UserStats = Models.UserStats
var ToDo = Models.ToDo
var Counter = Models.ToDoCounter

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

function createToDo (userId, token) {
  var opts = {
    method: 'POST',
    url: '/todos/?userId=' + userId,
    payload: { text: 'Clean my room' },
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function getToDo (userId, toDoId, token) {
  var opts = {
    method: 'GET',
    url: '/todos/' + toDoId + '/?userId=' + userId, 
    headers: { authorization: token }
  } 

  return Server.injectThen (opts)
}

function getAllToDos (userId, token) {
   var date = Moment(new Date()).format('YYYY-MM-DD')
   var opts = {
     method: 'GET',
     url: '/todos/all/?userId=' + userId + '&date=' + date,
     headers: { authorization: token }
   }
 
   return Server.injectThen (opts)
}

function updateToDo (userId, toDoId, token, updatedText) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var data = { text: 'Pay phone bill' }
  var opts = {
    method: 'PUT',
    url: '/todos/' + toDoId + '/?userId=' + userId + '&date=' + date,
    payload: { text: updatedText },
    headers: { authorization: token } 
  }

  return Server.injectThen (opts)
}

function checkToDo (userId, toDoId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/todos/' + toDoId + '/check/?userId=' + userId + '&date=' + date,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function uncheckToDo (userId, toDoId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/todos/' + toDoId + '/uncheck/?userId=' + userId + '&date=' + date,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function deleteToDo (userId, toDoId, token) {
  var opts = {
    method: 'DELETE',
    url: '/todos/' + toDoId + '/?userId=' + userId,
    headers: { authorization: token } 
  }

  return Server.injectThen (opts)
}

describe ('ToDo Task', function () {
  user = null
  toDoId = null
  
  beforeEach(function (done) {
    When(createUser()).then (function (result) {
      if (result != null)
        user = JSON.parse(result.payload) 
        done()   
    })
  })

  it ('Should create a to do task', function (done) {
    request = createToDo(user._id, user.token)
    request.then (function (response) {
      response.statusCode.should.equal (201)

      payload = JSON.parse(response.payload)
      payload.should.have.property('text')
      payload.should.have.property('user')
      toDoId = payload._id
      
      done()
    })
  })

  it ('Should not create a to do task (missing token)', function (done) {
    request = createToDo(user._id, null)
    request.then (function (response) {
      response.statusCode.should.equal(401)
      
      done()
    })
  })
  
  it ('Should not create a to do task (wrong token)', function (done) {
    request = createToDo(user._id, 'wrong_token')
    request.then (function (response) {
      response.statusCode.should.equal(401)

      done()
    })
  })

  describe ('Manipulations', function () {
    todo = null   

    beforeEach (function (done) {
      When(createToDo(user._id, user.token)).then (function (result) {
        if (result != null)
          todo = JSON.parse(result.payload)
          done()
      }) 
    })

    it ('Should get a to do task', function (done) {
      request = getToDo(user._id, todo._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('user')
        payload.should.have.property('state')

        done() 
      })
    })

    it ('Should not get a to do task (missing token)', function (done) {
      request = getToDo(user._id, todo._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)

        done()
      })
    })

    it ('Should not get a to do task (wrong token)', function (done) {
      request = getToDo(user._id, todo._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)

        done()
      })
    })

    it ('Should get all to do tasks', function (done) {
      request = getAllToDos(user._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('todos')
        assert.isArray(payload.todos)
        done()

      })
    })

    it ('Should not get all to do tasks (missing token)', function (done) {
      request = getAllToDos(user._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)

        done()
      })
    }) 

    it ('Should not get all to do tasks (wrong token)', function (done) {
      request = getAllToDos(user._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)

        done()
      })
    })

    it ('Should check a to do task', function (done) {
      request = checkToDo(user._id, todo._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('text')
        payload.should.have.property('user')
        payload.should.have.property('state')
        done()
      }) 
    })

    it ('Should not check a to do task (missing token)', function (done) {
      request = checkToDo(user._id, todo._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not check a task (wrong token)', function (done) {
      request = checkToDo(user._id, todo._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })
    
    it ('Should uncheck a to do task', function (done) {
      request = checkToDo(user._id, todo._id, user.token)
      request.then (function (response) {
        request = uncheckToDo(user._id, todo._id, user.token)
        request.then (function (response) {
          payload = JSON.parse(response.payload)

          response.statusCode.should.equal(200)
          payload.should.have.property('text')
          payload.should.have.property('user')
          payload.should.have.property('state')
          done()
        }) 
      })
    })

    it ('Should not uncheck a to do task (missing token)', function (done) {
      request = uncheckToDo(user._id, todo._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not uncheck a to do task (wrong token)', function (done) {
      request = uncheckToDo(user._id, todo._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should update a to do task', function (done) {
      preUpdateText = todo.text
      updatedText = 'Meditation 1h'

      request = updateToDo(user._id, todo._id, user.token, updatedText)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('state')
        payload.text.should.not.equal(preUpdateText)

        done()
      })
    })

    it ('Should delete a to do task', function (done) {
      request = deleteToDo(user._id, todo._id, user.token)
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
