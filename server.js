const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieSession = require('cookie-session');

const loginRoutes = require('./routes/Middleware/login');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const contactRoutes = require('./routes/contact');
const quizRoutes = require('./routes/getquiz');

const app = express();
app.use(bodyParser.json());
const dotenv = require('dotenv');
const { server, mongo_url, hashkey } = require('./variables/variables');
dotenv.config();
app.use(express.json());

app.use(cors({
  origin: server, // or '*' for all origins (not recommended in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // if you're sending cookies or authorization headers
}));

app.use('/api/auth', authRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/quiz',quizRoutes);
app.use('/api', require('./routes/dashboard'));

// Setup mail transporter (use Gmail or SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nithishvemula26@gmail.com',
    pass: 'zwrc uugt wnit ebph' // not your Gmail password
  }
});

//--Mongo Connections
const MONGO_URI = mongo_url
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error', err));

// Import route

app.use('/api/contact', contactRoutes);
app.use('/api/candidates',candidateRoutes);



//sessions

app.use(cookieSession({
  name: 'session',
  keys: [hashkey],
  maxAge: 60 * 60 * 1000, // 1 hour
  httpOnly: true,
  secure: false, // true if HTTPS
  sameSite: 'none',
}));


app.use('/api', loginRoutes);



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
