/**
 * MongoDB Database Connection
 */

import mongoose from 'mongoose';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect(uri) {
    try {
      if (this.connection) {
        console.log('✓ Already connected to MongoDB');
        return this.connection;
      }

      console.log('Connecting to MongoDB...');

      this.connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✓ MongoDB connected successfully');
      console.log(`  Database: ${mongoose.connection.name}`);
      console.log(`  Host: ${mongoose.connection.host}`);

      // Connection events
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;

    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        this.connection = null;
        console.log('✓ MongoDB disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error.message);
      throw error;
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }

  getConnection() {
    return mongoose.connection;
  }
}

export default new Database();
