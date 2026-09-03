import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { Asset } from '../models/Asset.js';
import { DocumentModel } from '../models/Document.js';
import { Claim } from '../models/Claim.js';
import { AuditLog } from '../models/AuditLog.js';

export const getDashboardData = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { deceasedId } = req.query;

    const deceasedFilter: any = { userId };
    if (deceasedId) deceasedFilter._id = deceasedId;

    const deceasedProfiles = await DeceasedProfile.find({ userId }).sort({ createdAt: -1 });
    const activeDeceased = deceasedId
      ? deceasedProfiles.find((p) => p._id.toString() === deceasedId)
      : deceasedProfiles[0];

    const currentDeceasedId = activeDeceased ? activeDeceased._id : null;

    const assetQuery: any = { userId };
    const docQuery: any = { userId };
    const claimQuery: any = { userId };

    if (currentDeceasedId) {
      assetQuery.deceasedId = currentDeceasedId;
      docQuery.deceasedId = currentDeceasedId;
      claimQuery.deceasedId = currentDeceasedId;
    }

    const [assets, documents, claims, auditLogs] = await Promise.all([
      Asset.find(assetQuery),
      DocumentModel.find(docQuery),
      Claim.find(claimQuery).populate('assetId'),
      AuditLog.find({ userId }).sort({ createdAt: -1 }).limit(8),
    ]);

    const totalAssets = assets.length;
    const potentialAssets = assets.filter((a) => a.status === 'Potential').length;
    const confirmedAssets = assets.filter((a) => a.status === 'Confirmed' || a.status === 'Claim Started' || a.status === 'Claim Completed').length;
    const activeClaims = claims.filter((c) => c.status !== 'Completed').length;
    const completedClaims = claims.filter((c) => c.status === 'Completed').length;
    const pendingDocuments = documents.filter((d) => d.status === 'Uploaded' || d.status === 'Needs Attention').length;

    // Calculate Overall FinClosure Progress Percentage
    let closureScore = 0;
    if (totalAssets > 0) {
      const assetProgressWeight = (confirmedAssets / totalAssets) * 30;
      const claimProgressSum = claims.reduce((acc, c) => acc + c.overallProgress, 0);
      const claimProgressWeight = claims.length > 0 ? (claimProgressSum / (claims.length * 100)) * 50 : 0;
      const docWeight = documents.length >= 3 ? 20 : (documents.length / 3) * 20;

      closureScore = Math.min(100, Math.round(assetProgressWeight + claimProgressWeight + docWeight));
    }

    // Generate "Needs Your Attention" items dynamically
    const attentionItems = [];

    if (potentialAssets > 0) {
      attentionItems.push({
        id: 'potential-assets',
        type: 'warning',
        title: `${potentialAssets} Potential Asset(s) Awaiting Confirmation`,
        message: 'AI identified unconfirmed financial assets. Review evidence and confirm portfolio membership.',
        actionLabel: 'Review Assets',
        link: '/assets',
      });
    }

    const unconfirmedClaims = claims.filter((c) => c.status === 'Documents Pending');
    if (unconfirmedClaims.length > 0) {
      attentionItems.push({
        id: 'claim-docs-pending',
        type: 'action',
        title: `${unconfirmedClaims.length} Claim(s) Pending Required Documents`,
        message: 'Complete the personalized document checklist to advance your claim to submission.',
        actionLabel: 'View Claims',
        link: '/claims',
      });
    }

    const readyClaims = claims.filter((c) => c.status === 'Ready to Submit');
    if (readyClaims.length > 0) {
      attentionItems.push({
        id: 'claim-ready-submit',
        type: 'success',
        title: `${readyClaims.length} Claim(s) Ready for Institution Submission`,
        message: 'All mandatory documents verified. You can now submit physical/digital application.',
        actionLabel: 'Submit Claim',
        link: `/claims/${readyClaims[0]._id}`,
      });
    }

    if (documents.length === 0) {
      attentionItems.push({
        id: 'no-docs',
        type: 'info',
        title: 'Upload Core Legal Documents',
        message: 'Upload Death Certificate and Claimant Identity Proof to enable automated document analysis.',
        actionLabel: 'Upload Documents',
        link: '/documents',
      });
    }

    res.json({
      activeDeceasedProfile: activeDeceased,
      allDeceasedProfiles: deceasedProfiles,
      stats: {
        totalAssets,
        potentialAssets,
        confirmedAssets,
        activeClaims,
        completedClaims,
        pendingDocuments,
        closureProgressPercentage: closureScore,
      },
      attentionItems,
      recentActivity: auditLogs,
    });
  } catch (error) {
    next(error);
  }
};
