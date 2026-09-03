import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { aiService } from '../services/ai/aiService.js';
import { Asset } from '../models/Asset.js';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { DocumentModel } from '../models/Document.js';
import { Claim } from '../models/Claim.js';
import { Notification } from '../models/Notification.js';
import { AIAnalysis } from '../models/AIAnalysis.js';
import { logAuditAction } from '../services/auditService.js';

export const discoverAssets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { deceasedId, textContext } = req.body;
    if (!deceasedId) {
      res.status(400).json({ message: 'Deceased Profile ID is required.' });
      return;
    }

    const deceased = await DeceasedProfile.findOne({ _id: deceasedId, userId });
    if (!deceased) {
      res.status(404).json({ message: 'Deceased profile not found.' });
      return;
    }

    const documents = await DocumentModel.find({ userId, deceasedId });
    const docSummaries = documents.map((d) => `${d.name} (${d.category}): ${d.extractedData?.summary || 'Uploaded document'}`);

    const discovered = await aiService.getProvider().discoverAssets({
      deceasedName: deceased.fullName,
      knownText: textContext || deceased.notes || '',
      documentSummaries: docSummaries,
    });

    // Save identified items to MongoDB as 'Potential' assets (requiring user confirmation)
    const createdAssets = [];
    for (const item of discovered) {
      const asset = await Asset.create({
        userId,
        deceasedId,
        name: `${item.institution} ${item.category}`,
        category: item.category,
        institution: item.institution,
        accountOrPolicyNumber: item.accountOrPolicyNumber,
        estimatedValue: item.estimatedValue || 0,
        status: 'Potential',
        isAiDiscovered: true,
        confidenceLevel: item.confidenceLevel,
        evidence: item.evidence,
        recommendedAction: item.recommendedAction,
        notes: item.whyIdentified,
      });
      createdAssets.push(asset);
    }

    // Save AI Analysis History
    await AIAnalysis.create({
      userId,
      deceasedId,
      analysisType: 'asset_discovery',
      promptContext: textContext || 'Auto-scan deceased notes & uploaded document references',
      aiResponse: discovered,
      providerUsed: aiService.providerName,
    });

    if (createdAssets.length > 0) {
      await Notification.create({
        userId,
        title: `${createdAssets.length} Potential Assets Discovered!`,
        message: `FinClosure AI identified potential financial assets requiring your review and confirmation.`,
        type: 'ai_discovery',
        link: '/assets',
      });
    }

    await logAuditAction(userId, 'AI_ASSET_DISCOVERY', 'Asset', undefined, `Discovered ${createdAssets.length} potential assets`);

    res.json({
      message: 'AI Asset Discovery complete.',
      discoveredCount: createdAssets.length,
      potentialAssets: createdAssets,
    });
  } catch (error) {
    next(error);
  }
};

export const analyzeDocumentAI = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400).json({ message: 'Document ID is required for AI analysis.' });
      return;
    }

    const doc = await DocumentModel.findOne({ _id: documentId, userId });
    if (!doc) {
      res.status(404).json({ message: 'Document not found or access denied.' });
      return;
    }

    const deceased = await DeceasedProfile.findById(doc.deceasedId);

    doc.status = 'Processing';
    await doc.save();

    const analysis = await aiService.getProvider().analyzeDocument({
      fileName: doc.name,
      fileCategory: doc.category,
      textContent: doc.notes || doc.name,
      deceasedName: deceased?.fullName,
    });

    doc.extractedData = {
      summary: analysis.summary,
      extractedNames: analysis.extractedNames,
      extractedNumbers: analysis.extractedNumbers,
      datesFound: analysis.datesFound,
      missingFields: analysis.missingFields,
      confidenceScore: analysis.confidenceScore,
    };

    doc.status = 'Reviewed';
    await doc.save();

    await AIAnalysis.create({
      userId,
      deceasedId: doc.deceasedId,
      analysisType: 'document_extraction',
      promptContext: `Document: ${doc.name}`,
      aiResponse: analysis,
      confidenceScore: analysis.confidenceScore,
      providerUsed: aiService.providerName,
    });

    await logAuditAction(userId!, 'AI_DOCUMENT_ANALYSIS', 'Document', doc._id.toString(), doc.name);

    res.json({ document: doc, analysis });
  } catch (error) {
    next(error);
  }
};

export const generateChecklistAI = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { assetCategory, institution, claimantRole, deceasedId } = req.body;

    const existingDocs = deceasedId
      ? await DocumentModel.find({ userId, deceasedId })
      : [];

    const checklist = await aiService.getProvider().generateChecklist({
      assetCategory: assetCategory || 'Bank Account',
      institution: institution || 'Financial Institution',
      claimantRole: claimantRole || 'Nominee',
      knownDocuments: existingDocs.map((d) => d.name),
    });

    res.json({ checklist });
  } catch (error) {
    next(error);
  }
};

export const getClaimGuidanceAI = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { claimId } = req.body;

    if (!claimId) {
      res.status(400).json({ message: 'Claim ID is required.' });
      return;
    }

    const claim = await Claim.findOne({ _id: claimId, userId }).populate('assetId').populate('deceasedId');
    if (!claim) {
      res.status(404).json({ message: 'Claim not found.' });
      return;
    }

    const docs = await DocumentModel.find({ userId, deceasedId: claim.deceasedId });

    const guidance = await aiService.getProvider().getClaimGuidance({
      assetCategory: (claim.assetId as any)?.category || 'Financial Asset',
      institution: claim.institution,
      claimStatus: claim.status,
      stepTitle: 'Active Step Review',
      claimantRole: (claim.deceasedId as any)?.claimantRole || 'Nominee',
      availableDocuments: docs.map((d) => d.name),
    });

    res.json({ guidance });
  } catch (error) {
    next(error);
  }
};

export const chatWithAssistant = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { userQuery, deceasedId, language } = req.body;
    if (!userQuery || userQuery.trim() === '') {
      res.status(400).json({ message: 'User question is required.' });
      return;
    }

    const deceased = deceasedId
      ? await DeceasedProfile.findOne({ _id: deceasedId, userId })
      : await DeceasedProfile.findOne({ userId }).sort({ createdAt: -1 });

    const assets = deceased
      ? await Asset.find({ userId, deceasedId: deceased._id })
      : await Asset.find({ userId });

    const documents = deceased
      ? await DocumentModel.find({ userId, deceasedId: deceased._id })
      : await DocumentModel.find({ userId });

    const claims = deceased
      ? await Claim.find({ userId, deceasedId: deceased._id })
      : await Claim.find({ userId });

    const response = await aiService.getProvider().chatWithContext({
      userQuery,
      language: language || 'en',
      deceasedProfile: deceased ? { fullName: deceased.fullName, relationship: deceased.relationship, claimantRole: deceased.claimantRole } : undefined,
      assetsSummary: assets.map((a) => ({ name: a.name, category: a.category, institution: a.institution, status: a.status, value: a.estimatedValue })),
      documentsSummary: documents.map((d) => ({ name: d.name, category: d.category, status: d.status })),
      claimsSummary: claims.map((c) => ({ institution: c.institution, status: c.status, progress: c.overallProgress })),
    });

    await AIAnalysis.create({
      userId,
      deceasedId: deceased?._id,
      analysisType: 'chat',
      promptContext: userQuery,
      aiResponse: response,
      providerUsed: aiService.providerName,
    });

    res.json({ response });
  } catch (error) {
    next(error);
  }
};
