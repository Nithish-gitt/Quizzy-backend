// ✅ No need to import MongoStore or connect for session
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const LoginData = require('../../models/LoginData');

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await LoginData.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Store minimal user info in session (stored in browser cookie)
  req.session.user = { id: user._id, username: user.username };

  res.json({ message: 'Login successful' });
});

// ✅ CHECK AUTH
router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

// ✅ LOGOUT
router.post('/logout', (req, res) => {
  req.session = null;  // This clears the encrypted session cookie
  res.clearCookie('session');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
