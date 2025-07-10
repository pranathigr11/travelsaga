// models/bookingModel.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour', // This creates a reference to the Tour model
    required: [true, 'A booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: [true, 'A booking must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'A booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true // For our dummy system, we assume it's paid instantly
  }
});

// This is a query middleware. It will run before any 'find' query.
// Its job is to automatically populate the 'user' and 'tour' fields.
bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name' // We only need the name of the tour for the booking info
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;