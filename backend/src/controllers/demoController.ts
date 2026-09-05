import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { Asset } from '../models/Asset.js';
import { DocumentModel } from '../models/Document.js';
import { Claim } from '../models/Claim.js';
import { ClaimStep } from '../models/ClaimStep.js';
import { ChecklistItem } from '../models/ChecklistItem.js';
import { Notification } from '../models/Notification.js';
import { logAuditAction } from '../services/auditService.js';

export const seedDemoScenario = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // 1. Create Deceased Profile (Rajesh Sharma)
    const deceased = await DeceasedProfile.create({
      userId,
      fullName: 'Late Rajesh Sharma (DEMO)',
      dateOfBirth: new Date('1962-04-15'),
      dateOfDeath: new Date('2026-01-10'),
      relationship: 'Father',
      claimantRole: 'Both',
      contactInfo: 'Mumbai, Maharashtra, India',
      knownInstitutions: ['Axis Bank', 'LIC of India', 'Star Health', 'Reliance Industries', 'EPFO', 'HDFC Bank', 'SBI'],
      notes: '[DEMO DATA] Preloaded sample financial portfolio.',
    });

    // 2. Create Sample Assets (6 Assets, 2 Liabilities, 3 Money to Recover)
    const assetsData = [
      // Assets
      { name: 'Reliance Industries / Jio Stock Holdings', category: 'Investment', institution: 'Reliance Industries / Jio', accountOrPolicyNumber: 'RIL-JIO-982104', estimatedValue: 200000, status: 'Confirmed', notes: '[DEMO DATA] Stock value: ₹2,00,000.' },
      { name: 'Axis Bank Savings Account', category: 'Bank Account', institution: 'Axis Bank', accountOrPolicyNumber: 'AXIS-9102938410', estimatedValue: 400000, status: 'Confirmed', notes: '[DEMO DATA] Balance: ₹4,00,000.' },
      { name: 'Life Insurance Policy', category: 'Insurance', institution: 'Life Insurance Corporation of India (LIC)', accountOrPolicyNumber: 'LIC-POL-10029384', estimatedValue: 10000000, status: 'Known', notes: '[DEMO DATA] Claim Value: ₹1,00,00,000 (₹1 Crore). Status: Claim Not Started.' },
      { name: 'Health Insurance Policy', category: 'Insurance', institution: 'Star Health Insurance', accountOrPolicyNumber: 'HLT-5509214', estimatedValue: 500000, status: 'Confirmed', notes: '[DEMO DATA] Coverage: ₹5,00,000. Status: Policy Active / Claim Guidance Available.' },
      { name: 'Government Scheme / Benefit', category: 'Pension', institution: 'Government of India / EPFO', accountOrPolicyNumber: 'GOV-SCH-39102', estimatedValue: 300000, status: 'Potential', notes: '[DEMO DATA] Estimated Benefit: ₹3,00,000. Status: Eligibility/Claim Pending.' },
      { name: 'Bank FD (Axis Bank Fixed Deposit)', category: 'Fixed Deposit', institution: 'Axis Bank', accountOrPolicyNumber: 'FD-9921048', estimatedValue: 400000, status: 'Confirmed', notes: '[DEMO DATA] Value: ₹4,00,000. Status: Claim Not Started.' },

      // Liabilities
      { name: 'Home Loan', category: 'Other', institution: 'HDFC Housing Finance', accountOrPolicyNumber: 'HL-882190', estimatedValue: 400000, status: 'Known', notes: '[DEMO DATA] Outstanding Home Loan: ₹4,00,000. Status: Outstanding.' },
      { name: 'Vehicle Loan', category: 'Other', institution: 'SBI Auto Loan', accountOrPolicyNumber: 'VL-773910', estimatedValue: 250000, status: 'Known', notes: '[DEMO DATA] Outstanding Vehicle Loan: ₹2,50,000 (Demo value). Status: Outstanding.' },

      // Money to Recover
      { name: 'Rakesh Loan Receivable', category: 'Other', institution: 'Rakesh (Friend)', accountOrPolicyNumber: 'REC-RAKESH-01', estimatedValue: 30000, status: 'Known', notes: '[DEMO DATA] Friend/Relative Loan. Amount: ₹30,000. Status: Recovery Pending.' },
      { name: 'Shreyansh Loan Receivable', category: 'Other', institution: 'Shreyansh (Relative)', accountOrPolicyNumber: 'REC-SHREYANSH-02', estimatedValue: 30000, status: 'Known', notes: '[DEMO DATA] Friend/Relative Loan. Amount: ₹30,000. Status: Recovery Pending.' },
      { name: 'Rahul + Anuj Personal Loan', category: 'Other', institution: 'Rahul + Anuj', accountOrPolicyNumber: 'REC-RAHUL-ANUJ-03', estimatedValue: 50000, status: 'Known', notes: '[DEMO DATA] Personal Loan. Combined Amount: ₹50,000. Status: Recovery Pending.' },
    ];

    const createdAssets = await Asset.insertMany(
      assetsData.map((a) => ({ ...a, userId, deceasedId: deceased._id }))
    );

    // 3. Create Sample Documents (9 Documents)
    const docsData = [
      { name: 'Death_Certificate_Rajesh_Sharma.pdf', category: 'Death Certificate', fileUrl: '/demo_death_certificate.pdf', fileKey: 'demo_death_cert_key' },
      { name: 'Life_Insurance_Policy_Bond.pdf', category: 'Insurance Document', fileUrl: '/demo_life_insurance_bond.pdf', fileKey: 'demo_life_ins_key' },
      { name: 'Health_Insurance_Policy_Card.pdf', category: 'Insurance Document', fileUrl: '/demo_health_insurance.pdf', fileKey: 'demo_health_ins_key' },
      { name: 'Axis_Bank_Account_Statement.pdf', category: 'Bank Document', fileUrl: '/demo_axis_bank_stmt.pdf', fileKey: 'demo_axis_stmt_key' },
      { name: 'Axis_Bank_FD_Certificate.pdf', category: 'Bank Document', fileUrl: '/demo_axis_fd_cert.pdf', fileKey: 'demo_axis_fd_key' },
      { name: 'Reliance_Jio_Stock_Holding_Statement.pdf', category: 'Investment Document', fileUrl: '/demo_reliance_jio_stocks.pdf', fileKey: 'demo_stocks_key' },
      { name: 'Home_Loan_Account_Statement.pdf', category: 'Bank Document', fileUrl: '/demo_home_loan_stmt.pdf', fileKey: 'demo_home_loan_key' },
      { name: 'Vehicle_Loan_Agreement.pdf', category: 'Bank Document', fileUrl: '/demo_vehicle_loan_doc.pdf', fileKey: 'demo_vehicle_loan_key' },
      { name: 'Government_Scheme_Eligibility_Doc.pdf', category: 'Pension Document', fileUrl: '/demo_govt_scheme_doc.pdf', fileKey: 'demo_govt_scheme_key' },
    ];

    const createdDocs = await DocumentModel.insertMany(
      docsData.map((d) => ({
        ...d,
        userId,
        deceasedId: deceased._id,
        mimeType: 'application/pdf',
        size: 1048576,
        status: 'Reviewed',
        extractedData: { summary: `Sample DEMO Document: ${d.name}` },
      }))
    );

    // 4. Create Active Claim
    const licAsset = createdAssets[2];
    const claim = await Claim.create({
      userId,
      deceasedId: deceased._id,
      assetId: licAsset._id,
      institution: 'Life Insurance Corporation of India (LIC)',
      claimType: 'Life Insurance Policy Settlement',
      claimReferenceNumber: 'LIC-CLAIM-2026-9812',
      status: 'Documents Pending',
      overallProgress: 30,
      notes: '[DEMO DATA] Claim for ₹1,00,00,000 (₹1 Crore) sum assured.',
    });

    const steps = [
      { stepNumber: 1, title: 'Document Review', description: 'Gather & verify death cert, policy bond, nominee ID', status: 'Completed', completedAt: new Date() },
      { stepNumber: 2, title: 'Collect Required Forms', description: 'Obtain Form 3783 & Form 3801', status: 'In Progress' },
      { stepNumber: 3, title: 'Fill & Attest Forms', description: 'Fill nominee bank details', status: 'Pending' },
      { stepNumber: 4, title: 'Branch Submission', description: 'Submit physical documents to LIC branch', status: 'Pending' },
      { stepNumber: 5, title: 'Settlement Payout', description: 'Direct bank credit of ₹1,00,00,000 claim sum', status: 'Pending' },
    ];

    await ClaimStep.insertMany(steps.map((s) => ({ ...s, claimId: claim._id })));

    await logAuditAction(userId, 'DEMO_SEED', 'DeceasedProfile', deceased._id.toString(), 'Seeded demo scenario');

    res.json({
      message: 'Demo scenario seeded successfully!',
      deceasedProfile: deceased,
      assets: createdAssets,
      documents: createdDocs,
      claim,
    });
  } catch (error) {
    next(error);
  }
};
