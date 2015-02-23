(function() {
  var FindOrCreate, Mongoose, Schema, Timestamps, habitSchema, userSchema;

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
    counter: {
      type: Number,
      "default": 0
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  userSchema.plugin(Timestamps);

  userSchema.plugin(FindOrCreate);

  habitSchema.plugin(Timestamps);

  userSchema.plugin(FindOrCreate);

  module.exports.User = Mongoose.model('User', userSchema);

  module.exports.Habit = Mongoose.model('Habit', habitSchema);

}).call(this);
