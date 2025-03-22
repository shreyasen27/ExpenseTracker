const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model

// ✅ Get Logged-in User's Details
router.get('/me', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch user from MongoDB (excluding password)
    const user = await User.findById(req.session.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

module.exports = { router };
