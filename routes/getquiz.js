const express = require('express');
const router = express.Router();
const FileSet = require('../models/FileSet');
const FileSetPublic = require('../models/FileSetPublic');

router.get('/', async (req, res) => {
  try {
    const username = req.query.username;
    const testname = req.query.testname;
    const testVisibility = req.query.testVisibility;
    var contacts;
    if ((testname.includes('(publicTest)')) || testVisibility) {
       contacts = await FileSetPublic.find({ Testname: testname.replace(' (publicTest)', '').trim() }).sort({ createdAt: -1 });

    } else {
      contacts = await FileSet.find({ username: `${username}`, Testname: testname }).sort({ createdAt: -1 });
    }
    
    const questions = contacts.map(file => file.questionsText);
    const keys = contacts.map(file => file.keyText);
    res.json([questions,keys]);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

module.exports = router;