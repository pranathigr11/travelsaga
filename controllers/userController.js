// controllers/userController.js
const multer = require('multer');
const User = require('../models/userModel');

// --- 1. CONFIGURE MULTER FOR LOCAL DISK STORAGE ---
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The destination folder for saved images
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    // Format: user-[userId]-[timestamp].[extension]
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

// --- 2. CREATE A MULTER FILTER TO ALLOW ONLY IMAGES ---
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// --- 3. CREATE THE UPLOAD INSTANCE ---
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// --- 4. EXPORT THE UPLOAD MIDDLEWARE ---
// 'photo' is the name of the 'name' attribute on the file input field in the form
exports.uploadUserPhoto = upload.single('photo');

// --- 5. CREATE THE CONTROLLER TO UPDATE USER DATA ---
exports.updateMe = async (req, res, next) => {
  try {
    // Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return res.status(400).json({ status: 'fail', message: 'This route is not for password updates.' });
    }

    // Filter out unwanted fields
    const filteredBody = {
      name: req.body.name,
      email: req.body.email
    };
    // If a new file was uploaded, add its filename to the update object
    if (req.file) {
      filteredBody.photo = req.file.filename;
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};