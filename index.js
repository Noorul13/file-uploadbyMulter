const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const User = require('./models/userModel.js');
require('dotenv').config();
const PORT = process.env.PORT || 5000;

require('./db/dbconnection.js');

// Middleware
app.use(express.json());

// Disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function(err, name) {
            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

// Configure multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File type not allowed. Only JPG and PNG are accepted.'));
    },
});

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/users', (req, res) => {
    upload.array('files', 5)(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File is too large. Maximum size allowed is 2MB.' });
            }
            return res.status(500).json({ message: 'Multer error', error: err.message });
        } else if (err) {
            // An unknown error occurred when uploading
            return res.status(500).json({ message: 'Error occurred', error: err.message });
        }

        console.log(req.body);

        const {
            firstname,
            lastname,
            email,
            dateOfBirth,
            residentialStreet1,
            residentialStreet2,
            permanentStreet1,
            permanentStreet2
        } = req.body;



        // Prepare files array for user creation
        const files = req.files.map(file => ({
            filename: file.filename, // Change this to file.filename to use the new name
            filetype: file.mimetype,
            filesize: file.size,
            path: file.path,
        }));

        // Prepare the user object
        const newUserData = {
            firstname,
            lastname,
            email,
            dateOfBirth,
            residentialStreet1,
            residentialStreet2,
            permanentStreet1,
            permanentStreet2,
            files,
        };

        try {
            const newUser = new User(newUserData);
            await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
