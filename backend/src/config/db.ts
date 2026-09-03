import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

// Configure Node.js DNS to use reliable public DNS servers for Atlas SRV record resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if dns.setServers cannot be changed in environment
}

export const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in backend/.env environment configuration.');
  }

  // Connect Mongoose to MongoDB Atlas with database name 'finclosure'
  const conn = await mongoose.connect(mongoUri, {
    dbName: 'finclosure',
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`[MongoDB Atlas] Successfully connected to Cluster host: ${conn.connection.host}`);
  console.log(`[MongoDB Atlas] Database: ${conn.connection.name}`);
  return conn;
};
