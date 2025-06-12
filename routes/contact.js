const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { host_mail, server, JWT_SECRET_ } = require('../variables/variables');

const JWT_SECRET= JWT_SECRET_;
const BASE_URL= server;

router.post('/', async (req, res) => {
  const { name, email, mobile, institute } = req.body;
  try {
    const newContact = new Contact({ name, email, mobile, institute });
    await newContact.save();
    res.status(201).json({ message: 'Contact request saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving contact request' });
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ approved: false }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});


// Approve contact
router.put('/:id/approve', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    // const getcontact = await Contact.findById(req.params.id);

    res.json({ message: 'Contact approved', contact });
  } catch (err) {
    res.status(500).json({ error: 'Error approving contact' });
  }
});

//Send Registration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: host_mail,
    pass: 'zwrc uugt wnit ebph' // not your Gmail password
  }
});

router.post('/:id/send-email', async(req, res) => {
    try{
  const getcontact = await Contact.findById(req.params.id);
  const token = jwt.sign({ id: req.params.id,  email: getcontact.email }, JWT_SECRET, { expiresIn: '15m' });
  const resetLink = `${BASE_URL}/Quizzy/#/reset-password/${token}`;
  const to = getcontact.email;
  const subject = `Login Request Approved`;
  const text = `Hi ${getcontact.name}. your login request approved.\n
  SetUp Your password here - "${resetLink}" \nThankYou,\nQuizzy`;

  const mailOptions = {
    from: host_mail,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    res.send('Email sent successfully');

  });
}
catch (err) {
    res.status(500).json({ error: 'Error Sending Mail' });
  }
});

module.exports = router;
