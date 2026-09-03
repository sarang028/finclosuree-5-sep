import { Response, NextFunction } from 'express';
import { Claim } from '../models/Claim.js';
import { ClaimStep } from '../models/ClaimStep.js';
import { ChecklistItem } from '../models/ChecklistItem.js';
import { Asset } from '../models/Asset.js';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { DocumentModel } from '../models/Document.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { claimSchema } from '../validators/index.js';
import { logAuditAction } from '../services/auditService.js';
import { Notification } from '../models/Notification.js';
import { aiService } from '../services/ai/aiService.js';

export const getClaims = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { deceasedId, status } = req.query;

    const query: any = { userId };
    if (deceasedId) query.deceasedId = deceasedId;
    if (status) query.status = status;

    const claims = await Claim.find(query)
      .populate('assetId')
      .populate('deceasedId')
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    next(error);
  }
};

export const getClaimById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const claim = await Claim.findOne({ _id: id, userId })
      .populate('assetId')
      .populate('deceasedId');

    if (!claim) {
      res.status(404).json({ message: 'Claim not found or access denied.' });
      return;
    }

    const steps = await ClaimStep.find({ claimId: claim._id }).sort({ stepNumber: 1 });
    const checklist = await ChecklistItem.find({ claimId: claim._id }).populate('associatedDocumentId');

    res.json({ claim, steps, checklist });
  } catch (error) {
    next(error);
  }
};

export const createClaim = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const parseResult = claimSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const { deceasedId, assetId, institution, claimType, claimReferenceNumber, notes } = parseResult.data;

    const asset = await Asset.findOne({ _id: assetId, userId });
    if (!asset) {
      res.status(404).json({ message: 'Referenced asset not found.' });
      return;
    }

    // Update asset status to 'Claim Started'
    asset.status = 'Claim Started';
    await asset.save();

    const claim = await Claim.create({
      userId,
      deceasedId,
      assetId,
      institution,
      claimType,
      claimReferenceNumber,
      notes,
      status: 'Documents Pending',
      overallProgress: 15,
    });

    // Seed Standard 6-Step Visual Claim Journey
    const defaultSteps = [
      { stepNumber: 1, title: 'Review Asset & Claim Terms', description: 'Review institution policy and verify claimant eligibility as Nominee or Legal Heir.', status: 'Completed' },
      { stepNumber: 2, title: 'Collect Required Documents', description: 'Gather Death Certificate, Claimant Identity Proof, and Asset ownership documents.', status: 'In Progress' },
      { stepNumber: 3, title: 'Complete Claim Forms', description: 'Fill standard claim forms required by institution.', status: 'Pending' },
      { stepNumber: 4, title: 'Submit Claim to Institution', description: 'Submit physical or digital claim package with official acknowledgments.', status: 'Pending' },
      { stepNumber: 5, title: 'Institution Verification', description: 'Monitor institution review and respond to any verification queries.', status: 'Pending' },
      { stepNumber: 6, title: 'Settlement & Closure', description: 'Verify payout transfer to claimant bank account and mark financial closure complete.', status: 'Pending' },
    ];

    await ClaimStep.insertMany(defaultSteps.map((s) => ({ ...s, claimId: claim._id })));

    // Generate Initial Checklist using AI provider
    const deceased = await DeceasedProfile.findById(deceasedId);
    const existingDocs = await DocumentModel.find({ userId, deceasedId });
    const knownDocNames = existingDocs.map((d) => d.name);

    const checklistItemsAI = await aiService.getProvider().generateChecklist({
      assetCategory: asset.category,
      institution: asset.institution,
      claimantRole: deceased?.claimantRole || 'Nominee',
      knownDocuments: knownDocNames,
    });

    await ChecklistItem.insertMany(
      checklistItemsAI.map((item) => {
        // Auto-match uploaded document if matching category found
        const matchedDoc = existingDocs.find((d) => d.category === item.suggestedCategory || d.name.toLowerCase().includes(item.name.toLowerCase()));
        return {
          claimId: claim._id,
          name: item.name,
          explanation: item.explanation,
          isRequired: item.isRequired,
          isCompleted: !!matchedDoc,
          associatedDocumentId: matchedDoc ? matchedDoc._id : undefined,
        };
      })
    );

    await logAuditAction(userId, 'CLAIM_CREATE', 'Claim', claim._id.toString(), `${claimType} for ${institution}`);

    await Notification.create({
      userId,
      title: 'New Financial Claim Initiated',
      message: `Claim for ${asset.name} at ${institution} has been created. Start completing your document checklist.`,
      type: 'action_required',
      link: `/claims/${claim._id}`,
    });

    res.status(201).json({ claim });
  } catch (error) {
    next(error);
  }
};

export const updateClaim = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const claim = await Claim.findOne({ _id: id, userId });
    if (!claim) {
      res.status(404).json({ message: 'Claim not found or access denied.' });
      return;
    }

    const { status, overallProgress, notes, claimReferenceNumber } = req.body;

    if (status) claim.status = status;
    if (typeof overallProgress === 'number') claim.overallProgress = overallProgress;
    if (notes) claim.notes = notes;
    if (claimReferenceNumber) claim.claimReferenceNumber = claimReferenceNumber;

    if (status === 'Completed') {
      claim.overallProgress = 100;
      claim.completedAt = new Date();

      // Update associated asset status
      await Asset.findByIdAndUpdate(claim.assetId, { status: 'Claim Completed' });

      await Notification.create({
        userId,
        title: 'Financial Claim Completed! 🎉',
        message: `Claim for ${claim.institution} has reached full completion and financial settlement.`,
        type: 'info',
        link: `/claims/${claim._id}`,
      });
    }

    await claim.save();

    await logAuditAction(userId!, 'CLAIM_UPDATE', 'Claim', claim._id.toString(), `Status: ${claim.status}`);

    res.json({ claim });
  } catch (error) {
    next(error);
  }
};

export const updateClaimStep = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;

    const step = await ClaimStep.findById(stepId);
    if (!step) {
      res.status(404).json({ message: 'Claim step not found.' });
      return;
    }

    step.status = status;
    if (status === 'Completed') {
      step.completedAt = new Date();
    }
    await step.save();

    // Recalculate Claim overall progress
    const allSteps = await ClaimStep.find({ claimId: step.claimId });
    const completedCount = allSteps.filter((s) => s.status === 'Completed').length;
    const progress = Math.round((completedCount / allSteps.length) * 100);

    const claim = await Claim.findById(step.claimId);
    if (claim) {
      claim.overallProgress = progress;
      if (progress === 100) {
        claim.status = 'Completed';
        claim.completedAt = new Date();
        await Asset.findByIdAndUpdate(claim.assetId, { status: 'Claim Completed' });
      }
      await claim.save();
    }

    res.json({ step, overallProgress: progress });
  } catch (error) {
    next(error);
  }
};

export const toggleChecklistItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { itemId } = req.params;
    const { isCompleted, associatedDocumentId } = req.body;

    const item = await ChecklistItem.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Checklist item not found.' });
      return;
    }

    if (typeof isCompleted === 'boolean') item.isCompleted = isCompleted;
    if (associatedDocumentId !== undefined) item.associatedDocumentId = associatedDocumentId;

    await item.save();

    res.json({ item });
  } catch (error) {
    next(error);
  }
};
