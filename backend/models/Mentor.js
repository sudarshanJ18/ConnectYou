const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  expertise: { type: [String], required: true },
  rating: { type: Number, required: true },
  availability: { type: String, required: true },
  image: { type: String, required: true },
  sessions: { type: Number, default: 0 },
});

module.exports = mongoose.model('Mentor', MentorSchema);
