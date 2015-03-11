(function() {
  var FindOrCreate, Mongoose, Schema, Timestamps, dailyTaskCounterSchema, dailyTaskSchema, habitCounterSchema, habitSchema, toDoCounterSchema, toDoSchema, userSchema, userStatsSchema;

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
    stats: {
      type: Schema.Types.ObjectId,
      ref: 'UserStats'
    }
  });

  habitSchema = new Schema({
    text: String,
    counters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'HabitCounter'
      }
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  habitCounterSchema = new Schema({
    value: {
      type: Number,
      "default": 0
    },
    habit: {
      type: Schema.Types.ObjectId,
      ref: 'Habit'
    }
  });

  dailyTaskSchema = new Schema({
    text: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  dailyTaskCounterSchema = new Schema({
    value: {
      type: Number,
      "default": 0
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'DailyTask'
    }
  });

  toDoSchema = new Schema({
    text: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  toDoCounterSchema = new Schema({
    value: {
      type: Number,
      "default": 0
    },
    todo: {
      type: Schema.Types.ObjectId,
      ref: 'ToDo'
    }
  });

  userStatsSchema = new Schema({
    hp: {
      type: Number,
      "default": 100
    },
    exp: {
      type: Number,
      "default": 0
    },
    gold: {
      type: Number,
      "default": 0
    },
    lvl: {
      type: Number,
      "default": 1
    },
    alive: {
      type: Boolean,
      "default": true
    }
  });

  userSchema.plugin(Timestamps);

  userSchema.plugin(FindOrCreate);

  habitSchema.plugin(Timestamps);

  userStatsSchema.plugin(Timestamps);

  userStatsSchema.plugin(FindOrCreate);

  habitCounterSchema.plugin(Timestamps);

  habitCounterSchema.plugin(FindOrCreate);

  dailyTaskSchema.plugin(Timestamps);

  dailyTaskSchema.plugin(FindOrCreate);

  dailyTaskCounterSchema.plugin(Timestamps);

  dailyTaskCounterSchema.plugin(FindOrCreate);

  toDoSchema.plugin(Timestamps);

  toDoSchema.plugin(FindOrCreate);

  toDoCounterSchema.plugin(Timestamps);

  toDoCounterSchema.plugin(FindOrCreate);

  module.exports.User = Mongoose.model('User', userSchema);

  module.exports.UserStats = Mongoose.model('UserStats', userStatsSchema);

  module.exports.Habit = Mongoose.model('Habit', habitSchema);

  module.exports.HabitCounter = Mongoose.model('HabitCounter', habitCounterSchema);

  module.exports.DailyTask = Mongoose.model('DailyTask', dailyTaskSchema);

  module.exports.DailyTaskCounter = Mongoose.model('DailyTaskCounter', dailyTaskCounterSchema);

  module.exports.ToDo = Mongoose.model('ToDo', toDoSchema);

  module.exports.ToDoCounter = Mongoose.model('ToDoCounter', toDoCounterSchema);

}).call(this);
