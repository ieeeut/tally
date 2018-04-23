const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const request = require('request');
const qs = require('querystring');
const User = require('../models/User');
const Settings = require('../models/Settings');

/**
 * Helper boi, generates a token given a user object
 */
const generateToken = (user) => {
  const payload = {
    iss: 'tally.ieeeut.org',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
 * Login required middleware
 */
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

  /**
   * POST /login
   * Sign in with email and password
   */
  exports.loginPost = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    const err = req.validationErrors();

    if (err) { return res.status(400).send(err); }


    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
        'Double-check your email address and try again.'
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch) {
          return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ token: generateToken(user), user: user.toJSON() });
      });
    });
  };

/**
 * POST /signup
 */
exports.signupPost = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('eid', 'EID cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const err = req.validationErrors();

  if (err) { return res.status(400).send(err); }


  User.findOne({ eid: req.body.eid }, (err, user) => {
    if (user) {
      return res.status(400).send({ msg: 'The eid you have entered is already associated with another account.' });
    }
    user = new User({
      eid: req.body.eid,
      email: req.body.email,
      password: req.body.password,
      meetingPoints: 0,
      admin: false,
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
      slackUsername: req.body.slackUsername || ''
    });
    user.save((err) => {
    res.send({ token: generateToken(user), user: user });
    });
  });
};

/**
 * POST /checkin
 */
exports.checkin = (req, res, next) => {
  req.assert('eid', 'EID cannot be blank').notEmpty();

  const err = req.validationErrors();

  if (err) return res.status(400).send(err);

  Settings.findOne({}, (err, settings) => {

    if (err) return res.status(400).send(err);

    if (!settings.meetingOpen && !settings.socialOpen) return res.status(400).send({ msg: 'There is no meeting or social open at the moment.' });

    User.findOne({ eid: req.body.eid }, (err, user) => {

      if (err) return res.status(400).send(err);

      if (user === null) return res.status(400).send({ msg: 'We do not have a previous record of the eid ' + req.body.eid + ' please create an account.' });

      if (user.admin) return res.status(400).send({ msg: 'Silly officer, you can\'t sign in at meetings!' });

      for (let checkin of user.checkins) {
        if (moment(checkin.timestamp) > moment().subtract(3, 'hours')) {
          return res.status(400).send({ msg: 'You have already checked in for this meeting' });
        }
      }

      if (settings.meetingOpen) {
        user.checkins.push({
          event: 'meeting',
          timestamp: moment()
        });
      } else {
        user.checkins.push({
          event: 'social',
          timestamp: moment()
        });
      }

      var points = 0;

      for (let checkin of user.checkins) {
        if (checkin.event == "meeting") {
          points += settings.meetingPoints;
        }
        else {
          points += settings.socialPoints;
        }
      }

      user.meetingPoints = points;

      user.save((err) => {
        console.log(err);
        if (err) { return res.status(400).send(err); }
        return res.send({ user: user, msg: 'Success! You are checked in for meeting. You have ' + user.meetingPoints + ' spark points.' });
      });
    });
  });

};

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = (req, res, next) => {
  if ('password' in req.body) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm', 'Passwords must match').equals(req.body.password);
  } else {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  const err = req.validationErrors();

  if (err) { return res.status(400).send(err); }

  User.findById(req.user.id, (err, user) => {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.eid = req.body.eid;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.slackUsername = req.body.slackUsername;
    }
    user.save((err) => {
      if ('password' in req.body) {
        res.send({ msg: 'Your password has been changed.' });
      } else if (err && err.code === 11000) {
        res.status(409).send({ msg: 'The email address or eid you have entered is already associated with another account.' });
      } else {
        res.send({ user: user, msg: 'Your profile information has been updated.' });
      }
    });
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    res.send({ msg: 'Your account has been permanently deleted.' });
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const err = req.validationErrors();

  if (err) { return res.status(400).send(err); }


  async.waterfall([
    (done) => {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {
      const transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      const mailOptions = {
        to: user.email,
        from: 'support@yourdomain.com',
        subject: '✔ Reset your password on Tally',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, (err) => {
        res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
        done(err);
      });
    }
  ]);
};

/**
 * POST /reset
 */
exports.resetPost = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirm', 'Passwords must match').equals(req.body.password);

  const err = req.validationErrors();

  if (err) { return res.status(400).send(err); }


  async.waterfall([
    (done) => {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user) => {
          if (!user) {
            return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err) => {
            done(err, user);
          });
        });
    },
    (user, done) => {
      const transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      const mailOptions = {
        from: 'support@yourdomain.com',
        to: user.email,
        subject: 'Your Tally password has been changed',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, (err) => {
        res.send({ msg: 'Your password has been changed successfully.' });
      });
    }
  ]);
};

/**
 * GET /api/users
 */
exports.getAllUsers = (req, res, next) => {
  User.find({}, (err, users) => {

    if (err) return res.status(400).send(err);

    return res.send({ users: users });
  });
};

/**
 * GET /api/users/:slackUsername
 */
exports.getUserBySlack = (req, res, next) => {
  User.find({slackUsername: req.params.slackUsername}, (err, users) => {

    if (err) return res.status(400).send(err);
    const user = users[0]
    return res.send({ user });
  });
};
