// routes/tourRoutes.js

const express = require('express');
const tourController = require('../controllers/tourController');
// --- THIS IS THE MISSING LINE THAT FIXES THE ERROR ---
const authController = require('../controllers/authController');

const router = express.Router();

// You can use router.param for pre-filling or validating parameters
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  // Protect the createTour route so only logged-in admins can do it
  .post(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'), // You can add this later for roles
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  // Protect the updateTour route
  .patch(
    authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  // Protect the deleteTour route
  .delete(
    authController.protect,
    // authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;