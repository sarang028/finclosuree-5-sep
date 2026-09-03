import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
} from '../controllers/documentController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(authenticateJWT as any);

router.get('/', getDocuments as any);
router.post('/', upload.single('file'), uploadDocument as any);
router.get('/:id', getDocumentById as any);
router.delete('/:id', deleteDocument as any);

export default router;
