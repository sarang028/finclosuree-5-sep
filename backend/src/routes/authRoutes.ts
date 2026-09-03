import { Router } from 'express';
import { register, login, getMe, initiateGoogleAuth, handleGoogleCallback } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT as any, getMe as any);

// Google OAuth 2.0 Routes
router.get('/google', initiateGoogleAuth);
router.get('/google/callback', handleGoogleCallback);

export default router;
