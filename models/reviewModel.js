// models/reviewModel.js
const mongoose = require('mongoose');
const Tour = require('./tourModel'); // Import Tour model for stats later

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Review must have a rating.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    // Parent Referencing: Each review knows which tour and user it belongs to.
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour', // Reference to the Tour model
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    // Schema options to ensure virtual properties are included in output
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// This query middleware will populate the 'user' field whenever a review is found
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo' // Only select the user's name and photo
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;