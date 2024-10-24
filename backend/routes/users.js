const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth'); // Middleware for token verification
const router = express.Router();

// GET current user data
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
