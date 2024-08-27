const mongoose = require('mongoose');

let isConnected = false; // Track the connection status

async function dbConnect() {
    if (isConnected) {
        console.log('=> using existing database connection');
        return;
    }

    try {
        await mongoose.connect("mongodb+srv://admin:admin123@cluster0.8jmykz6.mongodb.net/ecommerce", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('DB connection succeeded');
    } catch (err) {
        console.error('DB connection failed:', err.message);
        throw new Error('Failed to connect to the database');
    }
}

module.exports = dbConnect;
