// app.js

// --- 1. IMPORTS ---
// All imports should be at the top.
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // <--- IMPORT HELMET

// Import routers
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const authController = require('./controllers/authController');
const bookingRouter = require('./routes/bookingRoutes');
// --- 2. INITIAL CONFIGURATION ---
dotenv.config({ path: './.env' }); // Read .env file
const app = express(); // Create the express app

// --- 3. DATABASE CONNECTION ---
const DB = process.env.DATABASE;
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// --- 4. TEMPLATE ENGINE & STATIC FILES SETUP ---
// This setup should come before middleware that uses it.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://*.tiles.mapbox.com', 'https://api.mapbox.com', 'https://events.mapbox.com'],
      scriptSrc: ["'self'", 'https://unpkg.com/', 'https://tile.openstreetmap.org'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com/', 'https://tile.openstreetmap.org'],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      imgSrc: ["'self'", "blob:", "data:", 'https://unpkg.com/', 'https://*.tile.openstreetmap.org'],
      fontSrc: ["'self'"],
    },
  })
);


// --- 5. MIDDLEWARE ---
// This should come before the routes that need it.
app.use(express.json()); // Body parser for reading JSON from req.body
app.use(cookieParser());
app.use(authController.isLoggedIn);
// --- 6. MOUNTING THE ROUTERS ---
// This is where you define your application's routes.
app.use('/', viewRouter); // For rendering pages
app.use('/api/v1/tours', tourRouter); // For the tour API
app.use('/api/v1/users', userRouter); // For user authentication API
// Add this new route handler in app.js
app.use('/api/v1/bookings', bookingRouter);



// --- 7. START THE SERVER ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});