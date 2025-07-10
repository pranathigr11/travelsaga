// controllers/tourController.js
const Tour = require('../models/tourModel');

// GET ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

// GET A SINGLE TOUR (by ID) -- The New Function
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id }) does the same thing

    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'No tour found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};


// CREATE A NEW TOUR
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent. ' + err });
  }
};

// UPDATE A TOUR
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document rather than the original
      runValidators: true // Run schema validators on the update
    });

    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'No tour found with that ID' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
// DELETE A TOUR
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({ status: 'fail', message: 'No tour found with that ID' });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};