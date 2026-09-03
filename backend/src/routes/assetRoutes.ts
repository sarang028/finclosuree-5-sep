import { Router } from 'express';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  confirmAsset,
  deleteAsset,
} from '../controllers/assetController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', getAssets as any);
router.post('/', createAsset as any);
router.get('/:id', getAssetById as any);
router.put('/:id', updateAsset as any);
router.put('/:id/confirm', confirmAsset as any);
router.delete('/:id', deleteAsset as any);

export default router;
