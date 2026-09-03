import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    console.log('[Startup Step 1] Loading environment variables...');
    console.log('[Startup Step 2] Connecting to MongoDB Atlas...');

    await connectDB();

    console.log('[Startup Step 3] MongoDB Atlas connection verified successfully.');

    const PORT = parseInt(env.PORT, 10) || 5000;

    app.listen(PORT, () => {
      console.log(`[FinClosure Backend] Express server running on port ${PORT}`);
      console.log(`[FinClosure Backend] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[Google OAuth Diagnostic] CLIENT_ID: ${env.GOOGLE_CLIENT_ID ? 'configured' : 'MISSING'}`);
      console.log(`[Google OAuth Diagnostic] CLIENT_SECRET: ${env.GOOGLE_CLIENT_SECRET ? 'configured' : 'MISSING'}`);
      console.log(`[Google OAuth Diagnostic] CALLBACK_URL: ${env.GOOGLE_CALLBACK_URL}`);
    });
  } catch (error: any) {
    console.error(`\n==================================================`);
    console.error(`[MongoDB Atlas Connection Error] FAILED TO CONNECT TO MONGODB ATLAS.`);
    console.error(`Error Details: ${error.message}`);
    console.error(`==================================================\n`);
    console.error('[Startup Aborted] Express server will not start without a valid database connection.\n');
    process.exit(1);
  }
};

startServer();
