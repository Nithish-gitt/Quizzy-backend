const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const LoginData = require('../../models/LoginData');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await LoginData.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = { id: user._id, username: user.username };

    res.json({ message: 'Login successful' });
    console.log(req.session.user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/check-auth', (req, res) => {
  const {user} = req.session.user;
  console.log('/check-auth-logs',user);
  if (req.session?.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.status(401).json({ authenticated: false });
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('session');
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
