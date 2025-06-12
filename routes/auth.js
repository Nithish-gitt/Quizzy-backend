const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const LoginData = require('../models/LoginData'); // Import model
const bcrypt = require('bcrypt'); // For hashing (recommended)
const { JWT_SECRET_ } = require('../variables/variables');


router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, username, email } = req.body;

  try {
    const decoded = jwt.verify(token,JWT_SECRET_);

    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save to logindata collection
    const newLogin = new LoginData({ username: username, password: hashedPassword , email: email});
    await newLogin.save();

    res.json({ message: '✅ Username and password saved successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: '⚠️ Username already exists' });
    }
    res.status(400).json({ message: '❌ Invalid or expired token' });
  }
});

module.exports = router;
