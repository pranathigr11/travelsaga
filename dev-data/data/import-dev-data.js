const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: `${__dirname}/../../.env` });

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILES
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// DELETE ALL DATA FROM COLLECTIONS
const deleteData = async () => {
  try {
    console.log('Deleting existing data...');
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
};

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    console.log('Importing new data...');
    
    // 1. Import users and tours first to get their IDs
    const createdUsers = await User.create(users, { validateBeforeSave: false });
    const createdTours = await Tour.create(tours);
    
    console.log('Users and Tours imported.');

    // 2. Map review data to include real tour and user IDs
    const regularUser = createdUsers.find(user => user.role === 'user');
    
    // Check if the regular user was found to prevent errors
    if (!regularUser) {
      console.log('Error: "Regular User" not found in users.json. Cannot create reviews.');
      process.exit();
    }

    const reviewsWithIds = reviews.map(review => {
      // Find a tour where the slug contains a simplified version of the review's tour name.
      // This is much more robust than an exact name match.
      const simplifiedReviewTourName = review.tour.toLowerCase().split(' ')[0]; // e.g., "maratha"
      const tour = createdTours.find(t => t.slug.includes(simplifiedReviewTourName));
      
      // If a tour is still not found, log an error and skip this review.
      if (!tour) {
        console.log(`Warning: Could not find a matching tour for review: "${review.review}". Skipping.`);
        return null; // This review will be filtered out later
      }

      return {
        review: review.review,
        rating: review.rating,
        tour: tour._id, // Replace tour name with tour ID
        user: regularUser._id // Replace user name with user ID
      };
    }).filter(review => review !== null); // Filter out any null entries

    // 3. Import the corrected reviews
    if (reviewsWithIds.length > 0) {
      await Review.create(reviewsWithIds);
      console.log(`${reviewsWithIds.length} reviews imported successfully.`);
    } else {
      console.log('No valid reviews to import.');
    }
    
    console.log('All data successfully loaded!');

  } catch (err) {
    console.log(err);
  }
};