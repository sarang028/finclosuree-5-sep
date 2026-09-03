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
      fullName: 'Rajesh Sharma (Demo Profile)',
      dateOfBirth: new Date('1958-06-12'),
      dateOfDeath: new Date('2026-01-10'),
      relationship: 'Father',
      claimantRole: 'Nominee',
      contactInfo: 'Mumbai, Maharashtra, India',
      knownInstitutions: ['HDFC Bank', 'LIC of India', 'SBI Life', 'Employees Provident Fund'],
      notes: 'Fictional demo profile for hackathon demonstration. All records are sample data.',
    });

    // 2. Create Sample Assets
    const hdfcBank = await Asset.create({
      userId,
      deceasedId: deceased._id,
      name: 'HDFC Savings Account',
      category: 'Bank Account',
      institution: 'HDFC Bank Ltd.',
      accountOrPolicyNumber: 'SB-5010098124',
      estimatedValue: 185000,
      status: 'Confirmed',
      notes: 'Main salary/savings account. Registered nominee: Ankit Sharma',
    });

    const licPolicy = await Asset.create({
      userId,
      deceasedId: deceased._id,
      name: 'LIC Jeevan Anand Policy',
      category: 'Insurance',
      institution: 'Life Insurance Corporation of India (LIC)',
      accountOrPolicyNumber: 'POL-98421039',
      estimatedValue: 500000,
      status: 'Claim Started',
      notes: 'Term life policy with death benefit claim.',
    });

    const sbiFd = await Asset.create({
      userId,
      deceasedId: deceased._id,
      name: 'SBI Fixed Deposit 1 Year',
      category: 'Fixed Deposit',
      institution: 'State Bank of India',
      accountOrPolicyNumber: 'FD-391028301',
      estimatedValue: 300000,
      status: 'Potential',
      isAiDiscovered: true,
      confidenceLevel: 'High',
      evidence: 'FD interest tax credit entry detected in tax form document.',
      recommendedAction: 'Verify deposit certificate with local SBI branch.',
      notes: 'Awaiting user confirmation.',
    });

    const epfoPension = await Asset.create({
      userId,
      deceasedId: deceased._id,
      name: 'EPFO Member Provident Fund & Pension',
      category: 'Pension',
      institution: 'Employees Provident Fund Organisation',
      accountOrPolicyNumber: 'UAN-10092830192',
      estimatedValue: 420000,
      status: 'Known',
      notes: 'Employer PF balance and family pension claim.',
    });

    // 3. Create Sample Documents
    const deathCert = await DocumentModel.create({
      userId,
      deceasedId: deceased._id,
      name: 'Death Certificate - Rajesh Sharma.pdf',
      category: 'Death Certificate',
      fileUrl: '/uploads/sample_death_certificate.pdf',
      fileKey: 'sample_death_certificate.pdf',
      mimeType: 'application/pdf',
      size: 450000,
      status: 'Reviewed',
      extractedData: {
        summary: 'Official Municipal Death Certificate issued in Mumbai for Rajesh Sharma.',
        extractedNames: ['Rajesh Sharma', 'Ankit Sharma (Informant)', 'Municipal Registrar'],
        extractedNumbers: ['REG-MUM-2026-99120'],
        datesFound: ['10-Jan-2026', '14-Jan-2026'],
        missingFields: [],
        confidenceScore: 96,
      },
    });

    const claimantId = await DocumentModel.create({
      userId,
      deceasedId: deceased._id,
      name: 'Claimant Aadhaar & PAN Card.pdf',
      category: 'Identity Proof',
      fileUrl: '/uploads/sample_identity_proof.pdf',
      fileKey: 'sample_identity_proof.pdf',
      mimeType: 'application/pdf',
      size: 320000,
      status: 'Reviewed',
      extractedData: {
        summary: 'Identity and address proof for claimant Ankit Sharma.',
        extractedNames: ['Ankit Sharma'],
        extractedNumbers: ['****-****-9182', 'ABCDE1234F'],
        datesFound: ['1992-04-18'],
        missingFields: [],
        confidenceScore: 95,
      },
    });

    // 4. Create Sample Active Claim for LIC Policy
    const claim = await Claim.create({
      userId,
      deceasedId: deceased._id,
      assetId: licPolicy._id,
      institution: 'LIC of India',
      claimType: 'Deceased Death Claim',
      claimReferenceNumber: 'CLM-LIC-2026-8819',
      status: 'Documents Pending',
      overallProgress: 35,
      notes: 'Claim forms submitted online, physical verification pending.',
    });

    // Seed steps for LIC Claim
    const steps = [
      { stepNumber: 1, title: 'Review Asset & Claim Terms', description: 'Verified registered nominee status on LIC portal.', status: 'Completed', completedAt: new Date() },
      { stepNumber: 2, title: 'Collect Required Documents', description: 'Gathered death certificate, policy bond, and claimant identity proof.', status: 'Completed', completedAt: new Date() },
      { stepNumber: 3, title: 'Complete Claim Forms', description: 'Filling LIC Form 3783 & Form 3801 for death claim settlement.', status: 'In Progress' },
      { stepNumber: 4, title: 'Submit Claim to Servicing Branch', description: 'Submit physical documents to LIC Mumbai branch.', status: 'Pending' },
      { stepNumber: 5, title: 'LIC Underwriting Verification', description: 'Track branch verification and claim approval.', status: 'Pending' },
      { stepNumber: 6, title: 'NEFT Payout & Financial Closure', description: 'Claim payout credit to claimant bank account.', status: 'Pending' },
    ];

    await ClaimStep.insertMany(steps.map((s) => ({ ...s, claimId: claim._id })));

    // Seed checklist for LIC Claim
    const checklist = [
      { claimId: claim._id, name: 'Original Death Certificate', explanation: 'Attested municipal death certificate', isRequired: true, isCompleted: true, associatedDocumentId: deathCert._id },
      { claimId: claim._id, name: 'Original LIC Policy Bond Document', explanation: 'Policy certificate #POL-98421039', isRequired: true, isCompleted: false },
      { claimId: claim._id, name: 'Claimant PAN Card & Aadhaar Proof', explanation: 'Identity & KYC proof of nominee Ankit Sharma', isRequired: true, isCompleted: true, associatedDocumentId: claimantId._id },
      { claimId: claim._id, name: 'LIC Claim Form 3783 (Claimant Statement)', explanation: 'Mandatory LIC form signed by nominee', isRequired: true, isCompleted: false },
      { claimId: claim._id, name: 'Claimant Bank Cancelled Cheque', explanation: 'For electronic fund transfer (NEFT) of claim sum', isRequired: true, isCompleted: false },
    ];

    await ChecklistItem.insertMany(checklist);

    // 5. Create Sample Notifications
    await Notification.create([
      {
        userId,
        title: 'Demo Profile Loaded Successfully',
        message: 'Loaded sample scenario: Rajesh Sharma (Deceased) & Ankit Sharma (Nominee) with 4 assets and 1 active claim.',
        type: 'info',
        link: '/dashboard',
      },
      {
        userId,
        title: 'Potential SBI Asset Identified',
        message: 'AI discovered SBI Fixed Deposit (FD-391028301) for ₹3,00,000 awaiting confirmation.',
        type: 'ai_discovery',
        link: '/assets',
      },
    ]);

    await logAuditAction(userId, 'DEMO_SEED', 'DeceasedProfile', deceased._id.toString(), 'Seeded hackathon demo scenario');

    res.json({
      message: 'Demo scenario seeded successfully!',
      deceasedProfile: deceased,
      assets: [hdfcBank, licPolicy, sbiFd, epfoPension],
      documents: [deathCert, claimantId],
      claim,
    });
  } catch (error) {
    next(error);
  }
};
