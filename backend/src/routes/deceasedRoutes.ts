import { Router } from 'express';
import {
  createDeceasedProfile,
  getDeceasedProfiles,
  getDeceasedProfileById,
  updateDeceasedProfile,
} from '../controllers/deceasedController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.post('/', createDeceasedProfile as any);
router.get('/', getDeceasedProfiles as any);
router.get('/:id', getDeceasedProfileById as any);
router.put('/:id', updateDeceasedProfile as any);

export default router;
