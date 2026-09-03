import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', getNotifications as any);
router.put('/read-all', markAllAsRead as any);
router.put('/:id/read', markAsRead as any);

export default router;
