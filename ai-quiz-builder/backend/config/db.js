const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Exits the process on failure so the app never runs against a dead DB.
 */
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern mongoose (6+/7+/8+) no longer needs useNewUrlParser/useUnifiedTopology
      // but explicit options are kept here for clarity and future-proofing.
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('[db] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[db] MongoDB disconnected');
    });
  } catch (error) {
    console.error(`[db] Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
