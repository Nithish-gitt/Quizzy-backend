const Candidate = require('../models/Candidate');

// Add new candidate
exports.addCandidate = async (req, res) => {
  const { username, candidateName, candidateEmail, candidateUsername } = req.body;

  try {
    const candidate = new Candidate({
      username,
      candidateName,
      candidateEmail,
      candidateUsername
    });

    await candidate.save();
    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all candidates (optional)
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
