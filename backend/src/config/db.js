import mongoose from 'mongoose';
import logger from './logger.js';

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required in production mode but was not found.');
    }
    const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/trrip';
    logger.info(`Connecting to MongoDB...`);
    const conn = await mongoose.connect(connString);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
