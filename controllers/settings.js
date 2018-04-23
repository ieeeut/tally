const jwt = require('jsonwebtoken');

const Settings = require('../models/Settings');
const User = require('../models/User');

/**
 * POST /api/settings
 * Open Checkin
 */
exports.settingsPost = (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
  const _id = jwt.verify(token, process.env.TOKEN_SECRET).sub;


  User.findById(_id, (err, user) => {
    if (!user.admin) { return res.status(403).send("Nice try punk!"); }

    Settings.findOne({}, (err, settings) => {
      switch(req.body.event) {
        case "meeting":
          settings.meetingOpen = true;
          settings.socialOpen = false;
          break;
        case "social":
          settings.meetingOpen = false;
          settings.socialOpen = true;
          break;
        default:
          res.status(400).send({ msg: 'Error trying to set settings.' } );
          break;
      }
      settings.save((err) => {
        if (err) return res.status(400).send(err);
        res.send({ settings: settings, msg: 'Settings have been updated successfully.' } );
      });
    });
  });
};

/**
 * DELETE /api/settings
 * Close checkin
 */
exports.settingsDelete = (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
  const _id = jwt.verify(token, process.env.TOKEN_SECRET).sub;


  User.findById(_id, (err, user) => {
    if (!user.admin) { return res.status(403).send("Nice try punk!"); }

    Settings.findOne({}, (err, settings) => {
      settings.socialOpen = false;
      settings.meetingOpen = false;
      settings.save((err) => {
        if (err) return res.status(400).send(err);
        res.send({ settings: settings, msg: 'Checkin has been closed successfully.' } );
      });
    });
  });
};

/**
 * PUT /api/settings
 * Update settings information
 */
exports.settingsPut = (req, res, next) => {

  // TODO: find a way to do this
  // req.assert('socialPoints', 'Social point value must be a number').isNaN();
  // req.assert('meetingPoints', 'Meeting point value must be a number').isNaN();

  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
  const _id = jwt.verify(token, process.env.TOKEN_SECRET).sub;

  User.findById(_id, (err, user) => {
    if (!user.admin) { return res.status(403).send("Nice try punk!"); }

    Settings.findOne({}, (err, settings) => {
      settings.socialPoints = req.body.socialPoints;
      settings.meetingPoints = req.body.meetingPoints;
      settings.save((err) => {
        if (err) return res.status(400).send(err);

        res.send({ settings: settings, msg: 'Settings have been updated successfully.' } );
      });
    });
  });
};

/**
 * GET /api/settings
 */
exports.settingsGet = (req, res, next) => {
  Settings.findOne({}, (err, settings) => {
    if (err) return res.status(400).send(err);
    return res.send({ settings: settings });
  });
};
