// controllers/authController.js
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// --- HELPER FUNCTIONS (No changes here) ---
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined; // Remove password from output

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user }
  });
};


// --- MAIN AUTH FUNCTIONS (No changes to existing functions) ---
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};


// --- MIDDLEWARE (No changes here) ---
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.redirect('/login');
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.redirect('/login');
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        res.locals.user = currentUser;
      }
    } catch (err) {
      // Ignore error, just don't set user
    }
  }
  next();
};


// =========================================================================
// --- NEW FUNCTION FOR PASSWORD UPDATE ---
// =========================================================================
exports.updateMyPassword = async (req, res, next) => {
  try {
    // 1) Get user from collection. The user ID is on req.user from the 'protect' middleware.
    // We must use .select('+password') to get the password field, which is normally hidden.
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if the POSTed current password is correct.
    const { passwordCurrent, password, passwordConfirm } = req.body;
    if (!(await user.correctPassword(passwordCurrent, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Your current password is wrong.' });
    }

    // 3) If passwords match, update the user's password.
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    // Calling user.save() will run all the pre-save hooks, like encrypting the new password.
    await user.save();

    // 4) Log the user in again by sending a new token.
    createSendToken(user, 200, res);

  } catch (err) {
    // Catch any errors, such as validation errors from the model (e.g., password too short).
    res.status(500).json({ status: 'error', message: err.message });
  }
};