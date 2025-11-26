require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connectDB'); 

const app = express();

connectDB();// connect to Mongo // database connect function

// basic endpoint to test server
app.get('/', (req, res) => {
    res.send("Job Pilot API running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});