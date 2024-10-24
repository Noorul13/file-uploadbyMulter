const mongoose = require('mongoose');

// Define a schema for the user
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  residentialStreet1: {
    type: String,
    required: true
  },
  residentialStreet2: {
    type: String,
  },
  permanentStreet1: {
    type: String,
    required: true
  },
  permanentStreet2: {
    type: String,
    // required: true
  },
  files: [{
    filename: {
      type: String,
      required: true,
    },
    filetype: {
      type: String,
      required: true,
      enum: ['image/jpeg', 'image/png','image.jpg'], // Only allow JPG and PNG
    },
    filesize: {
        type: Number,
        required: true,
        // validate: {
        //   validator: function(value) {
        //     return value <= 2 * 1024 * 1024; // Maximum 2 MB
        //   },
        //   message: 'File size must be less than or equal to 2 MB.',
        // },
    },
    path: {
        type: String,
        required: true
    }
  }],
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
