require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connectDB');  // database connect function

const app = express();

// connect to Mongo
connectDB();

// basic endpoint (optional)
app.get('/', (req, res) => {
    res.send("Job Pilot API running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});