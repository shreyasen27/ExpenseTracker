const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ✅ Register Route
router.post('/register', async (req, res) => {
  const { firstName, lastName, age, gender, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// ✅ Login Route (Fixed Session Issue)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Store user session (Fixed!)
    req.session.user = { id: user._id, email: user.email };
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.status(500).json({ message: 'Failed to save session' });
      }
      console.log("🟢 User logged in, session saved:", req.session.user);
      res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
    });

  } catch (error) {
    console.error('❌ Error logging in:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// ✅ Get Logged-in User (Fixed password issue)
router.get('/me', async (req, res) => {
  try {
    console.log("🔵 Session Data in /me:", req.session); // Debugging

    const userId = req.session.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Fetch user details (Exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// ✅ Logout Route (Destroy Session)
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    console.log("🔴 User logged out");
    res.json({ message: 'Logout successful' });
  });
});

module.exports = { router };
