import { Router } from 'express';
import { seedDemoScenario } from '../controllers/demoController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.post('/seed', seedDemoScenario as any);

export default router;
