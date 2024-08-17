require('dotenv').config();
require('dotenv').config({ path: '../.env' });
console.log("MongoDB URI: ", process.env.MONGO_URI);
console.log(process.env);
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
// const db = require('./db/queries');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db/pool');

// const mongoose = require("mongoose");

const indexRouter = require('./routes/index');
const categoryRouter = require('./routes/categoryroutes');
const itemRouter = require('./routes/itemroutes');
const loginRouter = require('./routes/loginroutes');
const signupRouter = require('./routes/signup');

const app = express();


// mongoose.set("strictQuery", false);
// const mongoDB = process.env.MONGO_URI;
// async function main() {
//   await mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

// }
// main().catch((err) => console.log(err));

app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const { rows } = await pool.query(query, [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    const user = rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/items', itemRouter);

// Routes
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username';
    const { rows } = await pool.query(query, [username, hashedPassword]);
    res.status(201).json({ user: rows[0], message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ user, message: 'Logged in successfully' });
    });
  })(req, res, next);
});

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed', details: err.message });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: res.locals.error
  });
});

module.exports = app;
