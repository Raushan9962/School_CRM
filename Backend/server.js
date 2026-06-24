const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require('./routes');
const syncDatabase = require('./config/syncDatabase');

const app = express();

app.use(cors());
app.use(express.json());

const path = require('path');

// Main entry point for API routes
app.use('/api', apiRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get("/", (req, res) => {
    res.send("School CRM API Server Running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Sync DB and then Start Server
syncDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});