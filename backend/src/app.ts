import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import deceasedRoutes from './routes/deceasedRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

const app: Express = express();

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file uploads directory
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/deceased', deceasedRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/demo', demoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2;
  res.json({
    success: true,
    server: 'ok',
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
