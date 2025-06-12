const express = require('express');
const router = express.Router();
const { addCandidate, getCandidates } = require('./candidateController.js');

router.post('/add', addCandidate);
router.get('/all', getCandidates);

module.exports = router;
