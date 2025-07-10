// controllers/bookingController.js
const Booking = require('../models/bookingModel');

// This function creates a new booking document
exports.createBooking = async (req, res, next) => {
  try {
    // We get the tour ID from the URL and the user ID from the 'protect' middleware
    const newBooking = await Booking.create({
      tour: req.params.tourId,
      user: req.user.id,
      price: req.body.price // We'll get the price from the request body
    });

    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Could not create booking. ' + err.message });
  }
};