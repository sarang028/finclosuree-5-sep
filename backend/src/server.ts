import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  await connectDB();

  const PORT = parseInt(env.PORT, 10) || 5000;

  app.listen(PORT, () => {
    console.log(`[FinClosure Backend] Express server running on port ${PORT}`);
    console.log(`[FinClosure Backend] Health check: http://localhost:${PORT}/api/health`);
    console.log(`[Google OAuth Diagnostic] CLIENT_ID: ${env.GOOGLE_CLIENT_ID ? 'configured' : 'MISSING'}`);
    console.log(`[Google OAuth Diagnostic] CLIENT_SECRET: ${env.GOOGLE_CLIENT_SECRET ? 'configured' : 'MISSING'}`);
    console.log(`[Google OAuth Diagnostic] CALLBACK_URL: ${env.GOOGLE_CALLBACK_URL}`);
  });
};

startServer();
