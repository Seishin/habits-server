(function() {
  var FindOrCreate, Mongoose, Schema, Timestamps, counterSchema, dailyTask, habitSchema, userSchema;

  Mongoose = require('mongoose');

  Timestamps = require('mongoose-timestamp');

  FindOrCreate = require('mongoose-findorcreate');

  Schema = Mongoose.Schema;

  userSchema = new Schema({
    email: {
      type: String,
      index: true,
      unique: true
    },
    password: String,
    name: String,
    profileAvatar: String,
    token: String,
    habits: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Habit'
      }
    ]
  });

  habitSchema = new Schema({
    text: String,
    counters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Counter'
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  dailyTask = new Schema({
    text: String,
    counters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Counter'
      }
    ]
  });

  counterSchema = new Schema({
    value: {
      type: Number,
      "default": 0
    },
    habit: {
      type: Schema.Types.ObjectId,
      ref: 'Habit'
    }
  });

  userSchema.plugin(Timestamps);

  userSchema.plugin(FindOrCreate);

  habitSchema.plugin(Timestamps);

  userSchema.plugin(FindOrCreate);

  counterSchema.plugin(Timestamps);

  counterSchema.plugin(FindOrCreate);

  module.exports.User = Mongoose.model('User', userSchema);

  module.exports.Habit = Mongoose.model('Habit', habitSchema);

  module.exports.Counter = Mongoose.model('Counter', counterSchema);

}).call(this);
