const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/mongodb');
const connectCloudinary = require('./config/cloudinary');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
connectDB();
connectCloudinary();

// Route
app.get('/', (req, res) => {
    res.send('API WORKING!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
