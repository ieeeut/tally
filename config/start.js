const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASS = process.env.ADMIN_PASS;

// Create a default admin user.
const User = require('../models/User');
const Settings = require('../models/Settings');

// If there is already a user
User.findOne({
  email: ADMIN_EMAIL
}).exec((err, user) => {
  if (!user){
    var u = new User();
    u.email = ADMIN_EMAIL;
    u.password = ADMIN_PASS;
    u.admin = true;
    u.points = 0;
    u.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

Settings.findOne({}).exec((err, settings) => {
  if (!settings){
    var settings = new Settings();
    settings.save();
  }
});
