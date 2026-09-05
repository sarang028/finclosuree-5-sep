import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

export default async function handler(req: any, res: any) {
  // Ensure the request path starts with /api if rewritten
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url}`;
  }
  await connectDB();
  return app(req, res);
}
