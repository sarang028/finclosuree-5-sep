import { Router } from 'express';
import {
  getClaims,
  getClaimById,
  createClaim,
  updateClaim,
  updateClaimStep,
  toggleChecklistItem,
} from '../controllers/claimController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', getClaims as any);
router.post('/', createClaim as any);
router.get('/:id', getClaimById as any);
router.put('/:id', updateClaim as any);

// Nested routes for claim steps & checklist
router.put('/steps/:stepId', updateClaimStep as any);
router.put('/:id/checklist/:itemId', toggleChecklistItem as any);

export default router;
