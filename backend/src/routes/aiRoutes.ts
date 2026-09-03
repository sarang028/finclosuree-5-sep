import { Router } from 'express';
import {
  discoverAssets,
  analyzeDocumentAI,
  generateChecklistAI,
  getClaimGuidanceAI,
  chatWithAssistant,
} from '../controllers/aiController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.post('/discover-assets', discoverAssets as any);
router.post('/analyze-document', analyzeDocumentAI as any);
router.post('/generate-checklist', generateChecklistAI as any);
router.post('/claim-guidance', getClaimGuidanceAI as any);
router.post('/chat', chatWithAssistant as any);

export default router;
