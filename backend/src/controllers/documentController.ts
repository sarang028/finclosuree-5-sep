import { Response, NextFunction } from 'express';
import { DocumentModel } from '../models/Document.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { storageService } from '../services/storage/storageService.js';
import { logAuditAction } from '../services/auditService.js';

export const getDocuments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { category, assetId, deceasedId } = req.query;

    const query: any = { userId };
    if (category) query.category = category;
    if (assetId) query.assetId = assetId;
    if (deceasedId) query.deceasedId = deceasedId;

    const documents = await DocumentModel.find(query).sort({ createdAt: -1 });
    res.json({ documents });
  } catch (error) {
    next(error);
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const doc = await DocumentModel.findOne({ _id: id, userId });
    if (!doc) {
      res.status(404).json({ message: 'Document not found or access denied.' });
      return;
    }

    res.json({ document: doc });
  } catch (error) {
    next(error);
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No document file uploaded.' });
      return;
    }

    const { deceasedId, assetId, category, name, notes } = req.body;

    if (!deceasedId || !category || !name) {
      res.status(400).json({ message: 'Deceased Profile ID, Document Category, and Document Name are required.' });
      return;
    }

    const uploadRes = await storageService.saveFile(req.file);

    const documentRecord = await DocumentModel.create({
      userId,
      deceasedId,
      assetId: assetId || undefined,
      name,
      category,
      fileUrl: uploadRes.fileUrl,
      fileKey: uploadRes.fileKey,
      mimeType: uploadRes.mimeType,
      size: uploadRes.size,
      status: 'Uploaded',
      notes,
    });

    await logAuditAction(userId, 'DOCUMENT_UPLOAD', 'Document', documentRecord._id.toString(), documentRecord.name);

    res.status(201).json({ document: documentRecord });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const doc = await DocumentModel.findOne({ _id: id, userId });
    if (!doc) {
      res.status(404).json({ message: 'Document not found or access denied.' });
      return;
    }

    await storageService.deleteFile(doc.fileKey);
    await DocumentModel.deleteOne({ _id: id });

    await logAuditAction(userId!, 'DOCUMENT_DELETE', 'Document', id, doc.name);

    res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
