/* eslint-disable no-useless-escape */
const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address required'],
      unique: true,
      validate: {
        validator(v) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
        },
        message: props => `${props.value} is not a valid email address.`
      },
    },
    thoughts: [thoughtSchema],
    friends: [userSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

// Virtual called friendCount that retrieves the length of the user's friends array field on query.
userSchema
  .virtual('friendCount')
  .get(function() {
    return this.friends.length;
  });

const User = model('user', userSchema);

module.exports = User;
