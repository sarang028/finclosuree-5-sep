import { DeceasedProfile, Asset, DocumentItem, Claim, ClaimStep, ChecklistItem, NotificationItem, DashboardData, User } from '../types';

export interface IdentityVerificationDetails {
  nomineeName: string;
  relationship: string;
  aadhaarMasked: string;
  panMasked: string;
  mobile: string;
  isConsentGiven: boolean;
  kycStatus: 'Pending' | 'In Progress' | 'Verified';
  kycVerifiedAt?: string;
  kycDemoId?: string;
}

export const DEMO_USER: User = {
  id: 'demo_user_123',
  fullName: 'Ankit Sharma (Demo User)',
  email: 'ankit.demo@finclosure.app',
  phone: '+91 98765 43210',
  role: 'claimant',
  provider: 'local',
};

export const DEMO_IDENTITY_VERIFICATION: IdentityVerificationDetails = {
  nomineeName: 'Ankit Sharma',
  relationship: 'Son / Nominee',
  aadhaarMasked: 'XXXX XXXX 4821',
  panMasked: 'ABCDE****F',
  mobile: '+91 98765 43210',
  isConsentGiven: true,
  kycStatus: 'Verified',
  kycVerifiedAt: new Date().toISOString(),
  kycDemoId: 'KYC-DEMO-2026-88492',
};

export const DEMO_DECEASED: DeceasedProfile = {
  _id: 'demo_deceased_1',
  userId: 'demo_user_123',
  fullName: 'Late Rajesh Sharma (DEMO)',
  relationship: 'Father',
  claimantRole: 'Both',
  dateOfBirth: '1962-04-15',
  dateOfDeath: '2026-01-10',
  notes: '[DEMO DATA] Deceased profile preloaded with simulated financial portfolio.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_ASSETS: Asset[] = [
  // ASSETS (6 Items)
  {
    _id: 'demo_asset_1',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Axis Bank Savings Account',
    category: 'Bank Account',
    recordType: 'Asset',
    institution: 'Axis Bank',
    accountOrPolicyNumber: 'AXIS-9102938410',
    estimatedValue: 400000,
    status: 'Confirmed',
    notes: '[DEMO DATA] Savings Account at Axis Bank. Balance: ₹4,00,000.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_2',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Reliance Industries / Jio Stock Holdings',
    category: 'Stocks',
    recordType: 'Asset',
    institution: 'Reliance Industries / Jio',
    accountOrPolicyNumber: 'RIL-JIO-982104',
    estimatedValue: 200000,
    status: 'Confirmed',
    notes: '[DEMO DATA] Stock holdings in Reliance Industries & Jio Platforms. Demo value: ₹2,00,000.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_3',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Axis Bank Fixed Deposit',
    category: 'Fixed Deposit',
    recordType: 'Asset',
    institution: 'Axis Bank',
    accountOrPolicyNumber: 'FD-9921048',
    estimatedValue: 400000,
    status: 'Claim Not Started',
    notes: '[DEMO DATA] Fixed Deposit (FD) at Axis Bank. Principal: ₹4,00,000. Status: Claim Not Started.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_4',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'LIC Term Life Insurance Policy',
    category: 'Insurance',
    recordType: 'Asset',
    institution: 'Life Insurance Corporation of India (LIC)',
    accountOrPolicyNumber: 'LIC-POL-10029384',
    estimatedValue: 10000000, // ₹1,00,00,000 (₹1 Crore)
    status: 'Claim Ready',
    notes: '[DEMO DATA] Term Life Insurance Policy with Sum Assured ₹1,00,00,000 (₹1 Crore). Status: Claim Ready.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_5',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Star Health Insurance Policy',
    category: 'Health Insurance',
    recordType: 'Asset',
    institution: 'Star Health Insurance',
    accountOrPolicyNumber: 'HLT-5509214',
    estimatedValue: 500000,
    status: 'Policy Active / Claim Guidance Available',
    notes: '[DEMO DATA] Health Insurance Policy with coverage ₹5,00,000. Status: Active / Guidance Available.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_6',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Government Scheme / Benefit',
    category: 'Government Scheme',
    recordType: 'Asset',
    institution: 'Government of India / EPFO',
    accountOrPolicyNumber: 'GOV-SCH-39102',
    estimatedValue: 300000,
    status: 'Eligibility/Claim Pending',
    notes: '[DEMO DATA] Government Pension Scheme / Benefit. Estimated benefit: ₹3,00,000. Status: Eligibility/Claim Pending.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // LIABILITIES (2 Items)
  {
    _id: 'demo_asset_7',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Home Loan',
    category: 'Home Loan',
    recordType: 'Liability',
    institution: 'HDFC Housing Finance',
    accountOrPolicyNumber: 'HL-882190',
    estimatedValue: 400000,
    status: 'Outstanding',
    notes: '[DEMO DATA] Home Loan outstanding balance: ₹4,00,000. Status: Outstanding.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_8',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Vehicle / Personal Loan',
    category: 'Vehicle Loan',
    recordType: 'Liability',
    institution: 'SBI Auto Loan',
    accountOrPolicyNumber: 'VL-773910',
    estimatedValue: 150000,
    status: 'Outstanding',
    notes: '[DEMO DATA] Vehicle/Personal Loan outstanding balance: ₹1,50,000. Status: Outstanding.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // MONEY TO BE RECOVERED (3 Items)
  {
    _id: 'demo_asset_9',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Rakesh Loan Receivable',
    category: 'Friend/Relative Loan',
    recordType: 'Money to Recover',
    institution: 'Rakesh (Friend/Relative)',
    accountOrPolicyNumber: 'REC-RAKESH-01',
    estimatedValue: 30000,
    status: 'Recovery Pending',
    notes: '[DEMO DATA] Personal loan given to Rakesh. Receivable: ₹30,000. Status: Recovery Pending.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_10',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Shreyansh Loan Receivable',
    category: 'Friend/Relative Loan',
    recordType: 'Money to Recover',
    institution: 'Shreyansh (Friend/Relative)',
    accountOrPolicyNumber: 'REC-SHREYANSH-02',
    estimatedValue: 30000,
    status: 'Recovery Pending',
    notes: '[DEMO DATA] Personal loan given to Shreyansh. Receivable: ₹30,000. Status: Recovery Pending.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_11',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Rahul + Anuj Personal Loan',
    category: 'Personal Loan',
    recordType: 'Money to Recover',
    institution: 'Rahul + Anuj',
    accountOrPolicyNumber: 'REC-RAHUL-ANUJ-03',
    estimatedValue: 50000,
    status: 'Recovery Pending',
    notes: '[DEMO DATA] Loan given to Rahul + Anuj. Receivable: ₹50,000. Status: Recovery Pending.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_DOCUMENTS: DocumentItem[] = [
  {
    _id: 'demo_doc_1',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Death_Certificate_Rajesh_Sharma.pdf',
    category: 'Death Certificate',
    fileUrl: '/demo_death_certificate.pdf',
    fileKey: 'demo_death_cert_key',
    mimeType: 'application/pdf',
    size: 1048576,
    status: 'Reviewed',
    extractedData: {
      summary: 'Official Municipal Death Certificate for Late Rajesh Sharma issued Jan 2026',
      extractedNames: ['Rajesh Sharma', 'Ankit Sharma (Son)'],
      extractedNumbers: ['MC-MUM-2026-09821'],
      datesFound: ['10/01/2026'],
      confidenceScore: 0.98,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_2',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Life_Insurance_Policy_Bond.pdf',
    category: 'Insurance Document',
    fileUrl: '/demo_life_insurance_bond.pdf',
    fileKey: 'demo_life_ins_key',
    mimeType: 'application/pdf',
    size: 2097152,
    status: 'Reviewed',
    extractedData: {
      summary: 'LIC Term Life Insurance Policy Bond #LIC-POL-10029384 with Sum Assured ₹1,00,00,000 (₹1 Crore).',
      extractedNames: ['Rajesh Sharma', 'Ankit Sharma (Nominee)'],
      extractedNumbers: ['LIC-POL-10029384', '10000000'],
      datesFound: ['15/05/2018'],
      confidenceScore: 0.97,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_3',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Health_Insurance_Policy_Card.pdf',
    category: 'Insurance Document',
    fileUrl: '/demo_health_insurance.pdf',
    fileKey: 'demo_health_ins_key',
    mimeType: 'application/pdf',
    size: 838860,
    status: 'Reviewed',
    extractedData: {
      summary: 'Star Health Insurance Policy #HLT-5509214 with ₹5,00,000 coverage.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['HLT-5509214', '500000'],
      datesFound: ['01/04/2025'],
      confidenceScore: 0.96,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_4',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Axis_Bank_Account_Statement.pdf',
    category: 'Bank Document',
    fileUrl: '/demo_axis_bank_stmt.pdf',
    fileKey: 'demo_axis_stmt_key',
    mimeType: 'application/pdf',
    size: 1572864,
    status: 'Reviewed',
    extractedData: {
      summary: 'Axis Bank Savings Account #AXIS-9102938410. Verified Balance: ₹4,00,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['AXIS-9102938410', '400000'],
      confidenceScore: 0.99,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_5',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Axis_Bank_FD_Certificate.pdf',
    category: 'Bank Document',
    fileUrl: '/demo_axis_fd_cert.pdf',
    fileKey: 'demo_axis_fd_key',
    mimeType: 'application/pdf',
    size: 1258291,
    status: 'Reviewed',
    extractedData: {
      summary: 'Axis Bank Fixed Deposit Certificate #FD-9921048. Principal: ₹4,00,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['FD-9921048', '400000'],
      confidenceScore: 0.98,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_6',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Reliance_Jio_Stock_Holding_Statement.pdf',
    category: 'Investment Document',
    fileUrl: '/demo_reliance_jio_stocks.pdf',
    fileKey: 'demo_stocks_key',
    mimeType: 'application/pdf',
    size: 943718,
    status: 'Reviewed',
    extractedData: {
      summary: 'Demat Holding Statement for Reliance Industries / Jio Stocks. Portfolio Value: ₹2,00,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['RIL-JIO-982104', '200000'],
      confidenceScore: 0.97,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_7',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Home_Loan_Account_Statement.pdf',
    category: 'Bank Document',
    fileUrl: '/demo_home_loan_stmt.pdf',
    fileKey: 'demo_home_loan_key',
    mimeType: 'application/pdf',
    size: 1468006,
    status: 'Reviewed',
    extractedData: {
      summary: 'HDFC Home Loan Account #HL-882190. Outstanding Principal: ₹4,00,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['HL-882190', '400000'],
      confidenceScore: 0.98,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_8',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Vehicle_Loan_Agreement.pdf',
    category: 'Bank Document',
    fileUrl: '/demo_vehicle_loan_doc.pdf',
    fileKey: 'demo_vehicle_loan_key',
    mimeType: 'application/pdf',
    size: 1153433,
    status: 'Reviewed',
    extractedData: {
      summary: 'SBI Vehicle Loan Agreement #VL-773910. Outstanding Loan: ₹1,50,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['VL-773910', '150000'],
      confidenceScore: 0.96,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_9',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Government_Scheme_Eligibility_Doc.pdf',
    category: 'Pension Document',
    fileUrl: '/demo_govt_scheme_doc.pdf',
    fileKey: 'demo_govt_scheme_key',
    mimeType: 'application/pdf',
    size: 1048576,
    status: 'Reviewed',
    extractedData: {
      summary: 'Government Pension Scheme Eligibility Document #GOV-SCH-39102. Estimated Benefit: ₹3,00,000.',
      extractedNames: ['Rajesh Sharma', 'Ankit Sharma'],
      extractedNumbers: ['GOV-SCH-39102', '300000'],
      confidenceScore: 0.95,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_CLAIMS: Claim[] = [
  {
    _id: 'demo_claim_1',
    userId: 'demo_user_123',
    deceasedId: DEMO_DECEASED,
    assetId: DEMO_ASSETS[3], // LIC Policy
    institution: 'Life Insurance Corporation of India (LIC)',
    claimType: 'Life Insurance Policy Settlement',
    claimReferenceNumber: 'LIC-CLAIM-2026-9812',
    status: 'Documents Pending',
    overallProgress: 30,
    notes: '[DEMO DATA] Life insurance policy claim settlement for ₹1,00,00,000 (₹1 Crore).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_claim_2',
    userId: 'demo_user_123',
    deceasedId: DEMO_DECEASED,
    assetId: DEMO_ASSETS[5], // Govt scheme
    institution: 'Government of India / EPFO',
    claimType: 'Government Scheme Benefit Claim',
    claimReferenceNumber: 'GOV-CLAIM-2026-4412',
    status: 'Under Verification',
    overallProgress: 50,
    notes: '[DEMO DATA] Claim for Government Scheme benefit of ₹3,00,000.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_CLAIM_STEPS: ClaimStep[] = [
  { _id: 'step_1', claimId: 'demo_claim_1', stepNumber: 1, title: 'Document Review', description: 'Gather & verify death cert, policy bond, nominee ID', status: 'Completed' },
  { _id: 'step_2', claimId: 'demo_claim_1', stepNumber: 2, title: 'Collect Required Forms', description: 'Obtain Form 3783 (Claimant Statement) & Form 3801', status: 'In Progress' },
  { _id: 'step_3', claimId: 'demo_claim_1', stepNumber: 3, title: 'Fill & Attest Forms', description: 'Fill nominee bank details with cancelled cheque', status: 'Pending' },
  { _id: 'step_4', claimId: 'demo_claim_1', stepNumber: 4, title: 'Branch Submission', description: 'Physical submission at servicing branch office', status: 'Pending' },
  { _id: 'step_5', claimId: 'demo_claim_1', stepNumber: 5, title: 'Settlement Payout', description: 'Direct bank credit of ₹1,00,00,000 claim value to Nominee', status: 'Pending' },
];

export const DEMO_CHECKLIST: ChecklistItem[] = [
  { _id: 'chk_1', claimId: 'demo_claim_1', name: 'Original Death Certificate', explanation: 'Attested Municipal Death Certificate of Late Rajesh Sharma', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[0] },
  { _id: 'chk_2', claimId: 'demo_claim_1', name: 'Original Life Insurance Policy Bond', explanation: 'Original policy bond #LIC-POL-10029384 for ₹1 Crore claim', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[1] },
  { _id: 'chk_3', claimId: 'demo_claim_1', name: 'Nominee Identity & KYC Proof', explanation: 'Masked Aadhaar (XXXX XXXX 4821) and PAN (ABCDE****F) of nominee Ankit Sharma', isRequired: true, isCompleted: true },
  { _id: 'chk_4', claimId: 'demo_claim_1', name: 'Axis Bank Passbook / Cancelled Cheque', explanation: 'Nominee Axis Bank Account details for NEFT claim transfer', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[3] },
  { _id: 'chk_5', claimId: 'demo_claim_1', name: 'Claimant Statement Form', explanation: 'Mandatory death claim settlement form filled & signed', isRequired: true, isCompleted: false },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: 'notif_1',
    userId: 'demo_user_123',
    title: '[DEMO MODE] Life Insurance Policy Claim Ready',
    message: 'Life Insurance Policy claim for ₹1,00,00,000 (₹1 Crore) is ready to initiate.',
    type: 'action_required',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'notif_2',
    userId: 'demo_user_123',
    title: '[DEMO MODE] Pending Loans Alert',
    message: '2 outstanding liabilities recorded: Home Loan (₹4,00,000) & Vehicle Loan (₹1,50,000). Total ₹5.50 Lakhs.',
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'notif_3',
    userId: 'demo_user_123',
    title: '[DEMO MODE] Money to Recover Alert',
    message: '3 loans pending recovery total ₹1,10,000 (Rakesh ₹30k, Shreyansh ₹30k, Rahul + Anuj ₹50k).',
    type: 'status_change',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_DASHBOARD: DashboardData = {
  activeDeceasedProfile: DEMO_DECEASED,
  allDeceasedProfiles: [DEMO_DECEASED],
  stats: {
    totalAssets: 6,
    totalAssetsValue: 11800000, // ₹1,18,00,000 (₹1.18 Crore)
    totalLiabilitiesCount: 2,
    totalLiabilitiesValue: 550000, // ₹5,50,000 (₹5.50 Lakhs)
    totalRecoverableCount: 3,
    totalRecoverableValue: 110000, // ₹1,10,000 (₹1.1 Lakhs)
    potentialAssets: 1,
    confirmedAssets: 5,
    activeClaims: 2,
    completedClaims: 0,
    pendingDocuments: 9,
    closureProgressPercentage: 65,
  },
  attentionItems: [
    {
      id: 'att_1',
      type: 'warning',
      title: 'Action Needed: Life Insurance Claim Ready',
      message: 'Sum assured of ₹1,00,00,000 (₹1 Crore) is ready for claim submission.',
      actionLabel: 'Initiate Claim',
      link: '/claims',
    },
    {
      id: 'att_2',
      type: 'info',
      title: 'Money to Recover Pending',
      message: '3 loans pending recovery total ₹1,10,000 (Rakesh ₹30k, Shreyansh ₹30k, Rahul + Anuj ₹50k).',
      actionLabel: 'View Recoverables',
      link: '/assets',
    },
  ],
  recentActivity: [
    {
      _id: 'act_1',
      action: 'Nominee Identity Verified (Simulated Video KYC)',
      entityType: 'User',
      details: 'Ankit Sharma (Son/Nominee) - Masked Aadhaar: XXXX XXXX 4821',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'act_2',
      action: 'AI Discovery Completed: Financial Footprint Found',
      entityType: 'DeceasedProfile',
      details: 'Total Assets: ₹1.18 Cr+ | Insurance: ₹1.05 Cr+ | Loans: ₹5.50 L | Recoverables: ₹1.10 L',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'act_3',
      action: 'LIC Life Insurance Policy bond verified in DEMO profile',
      entityType: 'Insurance',
      details: 'Claim Sum Assured ₹1,00,00,000 (₹1 Crore) recorded.',
      createdAt: new Date().toISOString(),
    },
  ],
};

export const getDemoAiResponse = (userQuery: string): { reply: string; confidence: number; suggestedActions?: string[]; safetyNotice?: string } => {
  const q = userQuery.toLowerCase();

  // 1. Assets Found Query
  if (q.includes('what assets') || q.includes('assets found') || q.includes('total assets') || q.includes('what was found') || q.includes('found assets')) {
    return {
      reply: 'Based on the demo financial profile, the following 6 financial assets were discovered (Total Value: ₹1.18 Cr+):\n\n1. 🏢 LIC Term Life Insurance: ₹1,00,00,000 (Status: Claim Ready)\n2. 🏥 Star Health Insurance Policy: ₹5,00,000 Coverage (Status: Active Policy)\n3. 🏦 Axis Bank Savings Account: ₹4,00,000 Balance (Status: Confirmed)\n4. 📈 Axis Bank Fixed Deposit: ₹4,00,000 Principal (Status: Claim Not Started)\n5. 📜 Government Scheme / Benefit: ₹3,00,000 (Status: Eligibility/Claim Pending)\n6. 📊 Reliance Industries / Jio Stocks: ₹2,00,000 Value (Status: Confirmed)',
      confidence: 0.99,
      suggestedActions: ['How do I claim the ₹1 crore life insurance?', 'What documents do I need?', 'Which claim should I complete first?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data for hackathon demonstration.',
    };
  }

  // 2. Insurance Coverage Query
  if (q.includes('insurance coverage') || q.includes('how much insurance') || q.includes('insurance total') || q.includes('policy coverage')) {
    return {
      reply: 'Based on the demo financial profile, total insurance coverage available is ₹1.05 Cr+:\n\n1. 🏢 Life Insurance Policy (LIC): ₹1,00,00,000 (₹1 Crore Sum Assured) - Status: Claim Ready\n2. 🏥 Health Insurance Policy (Star Health): ₹5,00,000 Coverage - Status: Policy Active / Claim Guidance Available',
      confidence: 0.99,
      suggestedActions: ['How do I claim the ₹1 crore life insurance?', 'What documents do I need?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // 3. Claiming 1 Crore Life Insurance Query
  if (q.includes('claim the') || q.includes('1 crore') || q.includes('how do i claim') || q.includes('claim lic') || q.includes('claim life insurance')) {
    return {
      reply: 'Based on the demo financial profile, here is how to claim the ₹1,00,00,000 (₹1 Crore) LIC Life Insurance policy:\n\n1. 📋 Gather Required Documents:\n   • Original Municipal Death Certificate of Late Rajesh Sharma\n   • Original Policy Bond (#LIC-POL-10029384)\n   • Nominee ID Proof (Masked Aadhaar: XXXX XXXX 4821, PAN: ABCDE****F)\n   • Nominee Cancelled Cheque / Bank Passbook for NEFT credit\n\n2. ✍️ Submit Form 3783 (Claimant Statement) & Form 3801 at servicing branch.\n3. ⏱️ Processing Time: 15 to 30 working days after Video KYC & verification.\n4. 🚀 Click "Start Claim" on the LIC Policy card in your dashboard to track step-by-step progress.',
      confidence: 0.99,
      suggestedActions: ['What documents do I need?', 'Which claim should I complete first?', 'Start Claim Journey'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // 4. Documents Needed Query
  if (q.includes('what documents') || q.includes('documents needed') || q.includes('document checklist') || q.includes('required documents')) {
    return {
      reply: 'Based on the demo financial profile, the essential documents required for overall financial closure are:\n\n1. Municipal Death Certificate of Deceased (Late Rajesh Sharma)\n2. Nominee Identity Proofs (Masked Aadhaar: XXXX XXXX 4821 & PAN: ABCDE****F)\n3. Original Policy Bonds / Fixed Deposit Receipts (LIC Bond #LIC-POL-10029384, Axis FD #FD-9921048)\n4. Bank Statements / Passbooks (Axis Bank #AXIS-9102938410)\n5. Demat Holding Statement (Reliance / Jio Stocks #RIL-JIO-982104)\n6. Loan Statements (HDFC Home Loan #HL-882190 & SBI Vehicle Loan #VL-773910)',
      confidence: 0.98,
      suggestedActions: ['How do I claim the ₹1 crore life insurance?', 'Which claim should I complete first?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // 5. Loan / Liabilities Query
  if (q.includes('loan') || q.includes('pending loan') || q.includes('liabilit') || q.includes('karz') || q.includes('home loan') || q.includes('vehicle loan') || q.includes('outstanding loan')) {
    return {
      reply: 'Based on the demo financial profile, there are 2 outstanding loans totaling ₹5,50,000:\n\n1. 🏠 Home Loan (HDFC Housing Finance): ₹4,00,000 (Status: Outstanding)\n2. 🚗 Vehicle / Personal Loan (SBI Auto Loan): ₹1,50,000 (Status: Outstanding)\n\nTotal Pending Liabilities: ₹5,50,000.',
      confidence: 0.98,
      suggestedActions: ['How much money do I need to recover?', 'Which claim should I complete first?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // 6. Money to Recover Query
  if (q.includes('money do i need to recover') || q.includes('recover') || q.includes('receivables') || q.includes('rakesh') || q.includes('shreyansh') || q.includes('rahul')) {
    return {
      reply: 'Based on the demo financial profile, total money to be recovered is ₹1,10,00,00 (₹1.10 Lakhs across 3 receivables):\n\n1. 👤 Rakesh: ₹30,000 (Friend/Relative Loan | Status: Recovery Pending)\n2. 👤 Shreyansh: ₹30,000 (Friend/Relative Loan | Status: Recovery Pending)\n3. 👥 Rahul + Anuj: ₹50,000 (Personal Loan | Status: Recovery Pending)\n\nTotal Money to Recover: ₹1,10,000.',
      confidence: 0.99,
      suggestedActions: ['What assets were found?', 'Which claim should I complete first?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // 7. Priority Claim Query
  if (q.includes('first') || q.includes('priority') || q.includes('complete first') || q.includes('which claim')) {
    return {
      reply: 'Based on the demo financial profile, we recommend prioritizing claims in this order:\n\n1. 🥇 LIC Life Insurance Policy (₹1,00,00,000): Highest value asset (Claim Ready). All documents & Video KYC are verified.\n2. 🥈 Axis Bank Savings & Fixed Deposit (Total ₹8,00,000): Quick settlement via direct nominee transfer.\n3. 🥉 Government Scheme / Pension Benefit (₹3,00,000): Requires form submission.\n4. 💳 HDFC Home Loan (₹4,00,000): Notify lender to check if loan protection insurance applies.',
      confidence: 0.97,
      suggestedActions: ['How do I claim the ₹1 crore life insurance?', 'What documents do I need?'],
      safetyNotice: 'DEMO MODE — Based on simulated financial profile data.',
    };
  }

  // Fallback Overview Response
  return {
    reply: 'Based on the demo financial profile of Late Rajesh Sharma:\n\n💰 Total Assets Found: ₹1.18 Cr+ (6 Items)\n• LIC Term Life Insurance: ₹1,00,00,000 (Claim Ready)\n• Star Health Insurance: ₹5,00,000 Coverage\n• Axis Bank Savings: ₹4,00,000\n• Axis Bank Fixed Deposit: ₹4,00,000\n• Government Scheme / Benefit: ₹3,00,000\n• Reliance / Jio Stocks: ₹2,00,000\n\n💳 Outstanding Liabilities: ₹5.50 Lakhs (Home Loan ₹4.00L, Vehicle Loan ₹1.50L)\n🤝 Money to Recover: ₹1.10 Lakhs (Rakesh ₹30k, Shreyansh ₹30k, Rahul + Anuj ₹50k)',
    confidence: 0.95,
    suggestedActions: [
      'What assets were found?',
      'How much insurance coverage is available?',
      'How do I claim the ₹1 crore life insurance?',
      'What documents do I need?',
      'How much loan is still pending?',
      'How much money do I need to recover?',
      'Which claim should I complete first?',
    ],
    safetyNotice: 'DEMO MODE — All responses use simulated demonstration data for prototype showcase.',
  };
};

export const initializeDemoStorage = () => {
  localStorage.setItem('finclosure_is_demo', 'true');
  localStorage.setItem('finclosure_token', 'demo_session_token_xyz987');
  localStorage.setItem('finclosure_user', JSON.stringify(DEMO_USER));
  localStorage.setItem('finclosure_demo_identity', JSON.stringify(DEMO_IDENTITY_VERIFICATION));
  localStorage.setItem('finclosure_demo_deceased', JSON.stringify(DEMO_DECEASED));
  localStorage.setItem('finclosure_demo_assets', JSON.stringify(DEMO_ASSETS));
  localStorage.setItem('finclosure_demo_documents', JSON.stringify(DEMO_DOCUMENTS));
  localStorage.setItem('finclosure_demo_claims', JSON.stringify(DEMO_CLAIMS));
  localStorage.setItem('finclosure_demo_notifications', JSON.stringify(DEMO_NOTIFICATIONS));
};

export const clearDemoStorage = () => {
  localStorage.removeItem('finclosure_is_demo');
  localStorage.removeItem('finclosure_token');
  localStorage.removeItem('finclosure_user');
  localStorage.removeItem('finclosure_demo_identity');
  localStorage.removeItem('finclosure_demo_deceased');
  localStorage.removeItem('finclosure_demo_assets');
  localStorage.removeItem('finclosure_demo_documents');
  localStorage.removeItem('finclosure_demo_claims');
  localStorage.removeItem('finclosure_demo_notifications');
};

