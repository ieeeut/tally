const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true},
  eid: { type: String, unique: true},
  admin: Boolean,
  checkins: Number,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  firstName: String,
  lastName: String,
  slackUsername: String
}, schemaOptions);

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
