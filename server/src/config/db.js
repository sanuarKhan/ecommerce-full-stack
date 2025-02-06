
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../secret');

const connectDB = async (options) => {
    
    try {
        await mongoose.connect(MONGODB_URI , options);
        console.log('Connected to MongoDB');
        mongoose.connection.on('error', (err) => {
            console.error(`Mongoose connection error: ${err}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
    }

module.exports = connectDB;


