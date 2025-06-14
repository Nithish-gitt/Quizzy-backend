const express = require('express');
const router = express.Router();
const FileSet = require('../models/FileSet');
const FileSetPublic = require('../models/FileSetPublic')

// POST /api/upload
router.post('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://nithish-gitt.github.io');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const { username, Testname, questionsText, keyText, makePublic } = req.body;
  const testVisibility = makePublic === true ? 'public' : 'private';

  if (!username || !Testname || !questionsText || !keyText) {
    return res.status(400).json({
      error: 'Missing required fields (username, Testname, questionsText, keyText)',
    });
  }

  try {
    if (testVisibility === 'private') {
      const existingFileSet = await FileSet.findOne({ username, Testname });
      if (existingFileSet) {
        return res.status(409).json({
          error: `A private quiz with the name '${Testname}' already exists for user '${username}'.`,
        });
      }

      const newFileSet = new FileSet({
        username,
        Testname,
        questionsText,
        keyText,
      });

      await newFileSet.save();

      return res.status(201).json({
        message: 'Private quiz uploaded successfully',
        fileSetId: newFileSet._id,
      });
    } else {
      const existingPublicTest = await FileSetPublic.findOne({ Testname });
      if (existingPublicTest) {
        return res.status(409).json({
          error: `A public quiz with the name '${Testname}' already exists. Please choose a different name.`,
        });
      }

      const newPublicFileSet = new FileSetPublic({
        username,
        Testname,
        questionsText,
        keyText,
      });

      await newPublicFileSet.save();

      return res.status(201).json({
        message: 'Public quiz uploaded successfully',
        fileSetId: newPublicFileSet._id,
      });
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Internal server error during file upload.' });
  }
});



router.get('/tests/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const testSet = new Set();

    // 1. Fetch tests from FileSet (user's private or public ones)
    const userTests = await FileSet.find({ username });

    userTests.forEach(record => {
      testSet.add(record.Testname); // add as-is for user's tests
    });

    // 2. Fetch all public tests from FileSetPublic
    const publicTests = await FileSetPublic.find();

    publicTests.forEach(record => {
      testSet.add(`${record.Testname} (publicTest)`); // append public label
    });

    const tests = Array.from(testSet);

    res.status(200).json({ tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ message: 'Server error while fetching tests' });
  }
});





module.exports = router;
