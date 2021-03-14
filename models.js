const { Schema, model } = require('mongoose');


const userSchema = Schema({
  username: { type: String, required: true, unique: true }
});

const User = model('User', userSchema);


const exerciseSchema = Schema({
  user: {
    type: Schema.Types.ObjectID,
    ref: 'User',
    required: true
  },
  date: {
    type: Number,
  },
  duration: { type: Number, required: true },
  description: { type: String, required: true }
});

const Exercise = model('Exercise', exerciseSchema);



module.exports = {
  User,
  Exercise
};