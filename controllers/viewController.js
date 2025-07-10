// controllers/viewController.js
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel'); // Import Booking model

exports.getOverview = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).render('overview', {
      title: 'All Tours',
      tours
    });
  } catch (err) {
    res.status(500).send('Error loading the overview page.');
  }
};

exports.getTour = async (req, res) => {
  try {
    // Find the tour by its slug
    const tour = await Tour.findOne({ slug: req.params.slug })
      // --- ADD THIS .populate() METHOD ---
      .populate({
        path: 'guides',
        fields: 'name photo role' // Specify which fields to include from the User document
      });

    if (!tour) {
      return res.status(404).send('There is no tour with that name.');
    }
    
    // Now, the 'tour' object will contain the full guide data, not just their IDs.
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour
    });
  } catch (err) {
    res.status(500).send('Error loading the tour page.');
  }
};


exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account'
  });
};
exports.getAccount = (req, res) => {
  // At this point, we know the user is logged in because the 'protect'
  // middleware ran successfully. The 'isLoggedIn' middleware has also
  // already placed the user data on res.locals. We just need to render the page.
  res.status(200).render('account', {
    title: 'Your Account'
  });
};

exports.getMyBookings = async (req, res, next) => {
  // 1) Find all bookings for the currently logged-in user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Extract just the tour IDs from the bookings
  const tourIDs = bookings.map(el => el.tour.id);

  // 3) Find all tours that match the extracted IDs
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours // We can reuse the 'overview.pug' template to display the tour cards
  });
};