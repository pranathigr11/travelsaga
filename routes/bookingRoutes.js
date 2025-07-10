// routes/bookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// All routes after this middleware are protected
router.use(authController.protect);

// Route to create a booking for a specific tour
router.post('/:tourId', bookingController.createBooking);

module.exports = router;