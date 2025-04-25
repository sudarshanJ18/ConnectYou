const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all alumni users
router.get('/alumni', auth, async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' })
      .select('firstName lastName email role _id')
      .lean();

    res.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ message: 'Error fetching alumni users' });
  }
});

// Get all student users
router.get('/students', auth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('firstName lastName email role _id')
      .lean();

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching student users' });
  }
});

module.exports = router;