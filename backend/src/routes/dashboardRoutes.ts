import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', getDashboardData as any);

export default router;
