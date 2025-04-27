const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  meetingLink: { type: String, required: false } // New field for meeting/external link
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;