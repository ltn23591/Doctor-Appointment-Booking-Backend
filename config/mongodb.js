require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        console.log('Connect database Failed');
    }
};

module.exports = connectDB;
