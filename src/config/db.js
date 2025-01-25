const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("../utils/logger");


const connectDB = async () => {

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }


    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        conn.connection.on('disconnected', () => {
            logger.warn('Lost MongoDB connection');
        });

        conn.connection.on('reconnected', () => {
            logger.info('Reconnected to MongoDB');
        });

        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            await conn.connection.close();
            logger.info('MongoDB connection closed through app termination');
            process.exit(0);
        });


    } catch (error) {

        logger.error('Failed to connect to MongoDB', {
            message: error.message,
            stack: error.stack
        });

        if (error.name === 'MongoNetworkError') {
            logger.warn('Retrying MongoDB connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;