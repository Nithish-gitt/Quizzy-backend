const express = require('express');
const router = express.Router();
const TestResult = require('../models/TestResult');

// 🔒 GET /api/test-results — Requires user session
router.get('/test-results', async (req, res) => {
    const username = req.query.username;
  try {
    const results = await TestResult.find({ username: username }).sort({ date: -1 });
    res.json({ results });
  } catch (err) {
    console.error('Error fetching test results:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/submit-test', async (req, res) => {
  const { username, testname, score } = req.body;
  try {
    const newResult = new TestResult({
      username: username,
      testname: testname,
      score: score
    });

    await newResult.save();
    res.status(201).json({ message: 'Test result saved successfully' });
  } catch (err) {
    console.error('Error saving test result:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
