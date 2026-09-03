import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

// Configure Node.js DNS to use reliable public DNS servers for Atlas SRV record resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if dns.setServers cannot be changed in environment
}

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGO_URI || 'mongodb://127.0.0.1:27017/finclosure';

    // Attempt connection to MONGO_URI (e.g. MongoDB Atlas)
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'finclosure',
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Successfully connected to MongoDB host: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[Database Warning] Standard MongoDB connection failed: ${error.message}`);
    console.log(`[Database] Initializing automated In-Memory MongoDB Server fallback...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri, { dbName: 'finclosure' });
      console.log(`[Database] Successfully connected to In-Memory MongoDB fallback host: ${conn.connection.host}`);
    } catch (memError: any) {
      console.error(`[Database Error] In-Memory MongoDB fallback failed:`, memError);
    }
  }
};
