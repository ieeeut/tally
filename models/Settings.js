const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const settingsSchema = new mongoose.Schema({
  meetingOpen: { type: Boolean, required: true, default: false },
  socialOpen: { type: Boolean, required: true, default: false },
  meetingPoints: { type: Number, required: true, default: 20 },
  socialPoints: { type: Number, required: true, default: 10 },
  openTime: { type: Date }
}, schemaOptions);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
