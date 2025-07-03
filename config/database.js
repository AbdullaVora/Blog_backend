const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
        await mongoose.connect(dbURI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;