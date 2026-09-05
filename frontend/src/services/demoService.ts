import { DeceasedProfile, Asset, DocumentItem, Claim, ClaimStep, ChecklistItem, NotificationItem, DashboardData, User } from '../types';

export const DEMO_USER: User = {
  id: 'demo_user_123',
  fullName: 'Ankit Sharma (Demo User)',
  email: 'ankit.demo@finclosure.app',
  phone: '+91 98765 43210',
  role: 'claimant',
  provider: 'local',
};

export const DEMO_DECEASED: DeceasedProfile = {
  _id: 'demo_deceased_1',
  userId: 'demo_user_123',
  fullName: 'Late Rajesh Sharma (DEMO)',
  relationship: 'Father',
  claimantRole: 'Both',
  dateOfBirth: '1962-04-15',
  dateOfDeath: '2026-01-10',
  notes: '[DEMO DATA] Deceased profile preloaded with realistic sample financial portfolio.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_ASSETS: Asset[] = [
  // ASSETS (6 Items)
  {
    _id: 'demo_asset_1',
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
    _id: 'demo_asset_2',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Axis Bank Savings Account',
    category: 'Bank Account',
    recordType: 'Asset',
    institution: 'Axis Bank',
    accountOrPolicyNumber: 'AXIS-9102938410',
    estimatedValue: 400000,
    status: 'Confirmed',
    notes: '[DEMO DATA] Primary savings account at Axis Bank. Balance: ₹4,00,000.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_3',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Life Insurance Policy',
    category: 'Insurance',
    recordType: 'Asset',
    institution: 'Life Insurance Corporation of India (LIC)',
    accountOrPolicyNumber: 'LIC-POL-10029384',
    estimatedValue: 10000000, // ₹1,00,00,000 (₹1 Crore)
    status: 'Claim Not Started',
    notes: '[DEMO DATA] Term Life Insurance Policy with Sum assured / claim value ₹1,00,00,000 (₹1 Crore). Status: Claim Not Started.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_4',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Health Insurance Policy',
    category: 'Health Insurance',
    recordType: 'Asset',
    institution: 'Star Health Insurance',
    accountOrPolicyNumber: 'HLT-5509214',
    estimatedValue: 500000,
    status: 'Policy Active / Claim Guidance Available',
    notes: '[DEMO DATA] Health Insurance Policy with coverage ₹5,00,000. Status: Policy Active / Claim Guidance Available.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_5',
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
  {
    _id: 'demo_asset_6',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Bank FD (Axis Bank Fixed Deposit)',
    category: 'Fixed Deposit',
    recordType: 'Asset',
    institution: 'Axis Bank',
    accountOrPolicyNumber: 'FD-9921048',
    estimatedValue: 400000,
    status: 'Claim Not Started',
    notes: '[DEMO DATA] Bank Fixed Deposit (FD) at Axis Bank. Value: ₹4,00,000. Status: Claim Not Started.',
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
    name: 'Vehicle Loan',
    category: 'Vehicle Loan',
    recordType: 'Liability',
    institution: 'SBI Auto Loan',
    accountOrPolicyNumber: 'VL-773910',
    estimatedValue: 250000,
    status: 'Outstanding',
    notes: '[DEMO DATA] Vehicle Loan outstanding balance: ₹2,50,000 (Clearly marked demo value). Status: Outstanding.',
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
    notes: '[DEMO DATA] Loan given to Rakesh. Amount receivable: ₹30,000. Category: Friend/Relative Loan. Status: Recovery Pending.',
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
    notes: '[DEMO DATA] Loan given to Shreyansh. Amount receivable: ₹30,000. Category: Friend/Relative Loan. Status: Recovery Pending.',
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
    notes: '[DEMO DATA] Combined personal loan given to Rahul + Anuj. Amount receivable: ₹50,000. Category: Personal Loan. Status: Recovery Pending.',
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
      summary: 'Axis Bank Savings Account #AXIS-9102938410. Verified Closing Balance: ₹4,00,000.',
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
      summary: 'Axis Bank Fixed Deposit Certificate #FD-9921048. Principal Value: ₹4,00,000.',
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
      summary: 'CDSL Demat Holding Statement for Reliance Industries / Jio Stocks. Portfolio Value: ₹2,00,000.',
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
      summary: 'HDFC Home Loan Account #HL-882190 Statement. Outstanding Principal: ₹4,00,000.',
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
      summary: 'SBI Vehicle Loan Agreement #VL-773910. Outstanding Loan Amount: ₹2,50,000.',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['VL-773910', '250000'],
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
    assetId: DEMO_ASSETS[2],
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
    assetId: DEMO_ASSETS[4],
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
  { _id: 'chk_3', claimId: 'demo_claim_1', name: 'Nominee Identity & KYC Proof', explanation: 'Aadhaar Card and PAN Card of claimant nominee Ankit Sharma', isRequired: true, isCompleted: true },
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
    message: '2 outstanding liabilities recorded: Home Loan (₹4,00,000) & Vehicle Loan (₹2,50,000).',
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
    totalLiabilitiesValue: 650000, // ₹6,50,000 (₹6.5 Lakhs)
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
      title: 'Action Needed: Life Insurance Claim Not Started',
      message: 'Sum assured of ₹1,00,00,000 (₹1 Crore) is pending claim initiation.',
      actionLabel: 'Initiate Claim',
      link: '/claims',
    },
    {
      id: 'att_2',
      type: 'info',
      title: 'Money to Recover Pending',
      message: '3 friends/relatives owe total ₹1,10,000 (Rakesh ₹30k, Shreyansh ₹30k, Rahul + Anuj ₹50k).',
      actionLabel: 'View Recoverables',
      link: '/assets',
    },
  ],
  recentActivity: [
    {
      _id: 'act_1',
      action: 'Life Insurance Policy bond verified in DEMO profile',
      entityType: 'Insurance',
      details: 'Claim Sum Assured ₹1,00,00,000 (₹1 Crore) recorded.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'act_2',
      action: 'Axis Bank Savings & Bank FD certificates loaded',
      entityType: 'Bank Account',
      details: 'Axis Bank Savings ₹4,00,000 + Bank FD ₹4,00,000.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'act_3',
      action: 'Home Loan & Vehicle Loan liabilities logged',
      entityType: 'Liability',
      details: 'Outstanding Home Loan ₹4,00,000 & Vehicle Loan ₹2,50,000.',
      createdAt: new Date().toISOString(),
    },
  ],
};

export const getDemoAiResponse = (userQuery: string): { reply: string; confidence: number; suggestedActions?: string[]; safetyNotice?: string } => {
  const q = userQuery.toLowerCase();

  // 1. Life Insurance Query
  if (q.includes('life insurance') || q.includes('life policy') || q.includes('claim kitna') || q.includes('insurance claim') || q.includes('1 crore') || q.includes('lic')) {
    return {
      reply: 'Demo profile ke according life insurance policy ka claim value ₹1 crore (₹1,00,00,000) hai.\n\n• Policy: Life Insurance Policy\n• Sum Assured / Claim Value: ₹1,00,00,000\n• Status: Claim Not Started\n• Institution: LIC of India',
      confidence: 0.99,
      suggestedActions: ['Start Life Insurance Claim', 'View Policy Document', 'Show All Assets'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only. No MongoDB or real account affected.',
    };
  }

  // 2. Father's Loans / Liabilities Query
  if (q.includes('loan') || q.includes('father') || q.includes('pending loan') || q.includes('liabilit') || q.includes('karz') || q.includes('home loan') || q.includes('vehicle loan') || q.includes('udhaar')) {
    return {
      reply: 'Demo profile ke according aapke father ke 2 loans pending (liabilities) hain:\n\n1. Home Loan: ₹4,00,000 (Status: Outstanding)\n2. Vehicle Loan: ₹2,50,000 (Status: Outstanding)\n\nTotal Pending Liabilities: ₹6,50,000.',
      confidence: 0.98,
      suggestedActions: ['View Home Loan Statement', 'View Vehicle Loan Document', 'Check All Liabilities'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 3. Money to Recover Query
  if (q.includes('paise') || q.includes('kaun kaun') || q.includes('dena hai') || q.includes('lene hai') || q.includes('recover') || q.includes('rakesh') || q.includes('shreyansh') || q.includes('rahul') || q.includes('anuj')) {
    return {
      reply: 'Demo profile ke according paise dene wale / recover hone wale (receivables) ka detail is tarah hai:\n\n1. Rakesh: ₹30,000 (Category: Friend/Relative Loan | Status: Recovery Pending)\n2. Shreyansh: ₹30,000 (Category: Friend/Relative Loan | Status: Recovery Pending)\n3. Rahul + Anuj: ₹50,000 (Category: Personal Loan | Status: Recovery Pending)\n\nTotal Money to be Recovered: ₹1,10,000.',
      confidence: 0.99,
      suggestedActions: ['View Money to Recover', 'Send Recovery Reminder', 'Show All Receivables'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 4. Axis Bank / FD Query
  if (q.includes('axis') || q.includes('bank account') || q.includes('bank balance') || q.includes('fd') || q.includes('fixed deposit')) {
    return {
      reply: 'Demo profile mein Axis Bank accounts:\n\n1. Axis Bank Savings Account Balance: ₹4,00,000 (Status: Confirmed)\n2. Bank FD (Axis Bank Fixed Deposit): ₹4,00,000 (Status: Claim Not Started)\n\nTotal Axis Bank Assets: ₹8,00,000.',
      confidence: 0.97,
      suggestedActions: ['View Axis Bank Statement', 'View FD Certificate'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 5. Health Insurance Query
  if (q.includes('health')) {
    return {
      reply: 'Demo profile ke Health Insurance Policy details:\n\n• Coverage: ₹5,00,000\n• Provider: Star Health Insurance\n• Status: Policy Active / Claim Guidance Available',
      confidence: 0.97,
      suggestedActions: ['View Health Insurance Policy', 'Get Claim Guidance'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 6. Government Scheme Query
  if (q.includes('govt') || q.includes('government') || q.includes('scheme') || q.includes('yojana')) {
    return {
      reply: 'Demo profile ke Government Scheme / Benefit details:\n\n• Estimated Benefit: ₹3,00,000\n• Status: Eligibility/Claim Pending',
      confidence: 0.96,
      suggestedActions: ['View Government Scheme Document', 'Check Claim Eligibility'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 7. Stocks / Reliance / Jio Query
  if (q.includes('stock') || q.includes('share') || q.includes('reliance') || q.includes('jio')) {
    return {
      reply: 'Demo profile ke Stock Holdings:\n\n• Reliance Industries / Jio-related stock holdings\n• Demo Value: ₹2,00,000\n• Status: Confirmed',
      confidence: 0.97,
      suggestedActions: ['View Stock Statement'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // 8. Documents Query
  if (q.includes('document') || q.includes('file') || q.includes('kagaz')) {
    return {
      reply: 'Demo profile mein 9 corresponding document entries present hain:\n1. Death Certificate\n2. Life Insurance Policy\n3. Health Insurance Policy\n4. Axis Bank Statement\n5. FD Certificate\n6. Stock/Investment Statement\n7. Home Loan Statement\n8. Vehicle Loan Document\n9. Government Scheme Document',
      confidence: 0.98,
      suggestedActions: ['View Documents Page'],
      safetyNotice: 'DEMO MODE: Sample demonstration data only.',
    };
  }

  // Fallback Overview Response
  return {
    reply: 'Late Rajesh Sharma (DEMO Profile) sample financial portfolio overview:\n\n💰 Total Assets: ₹1,18,00,000 (₹1.18 Crore across 6 items)\n• Life Insurance Policy: ₹1,00,00,000 (Claim Not Started)\n• Axis Bank Account: ₹4,00,000 (Confirmed)\n• Bank FD (Axis Bank FD): ₹4,00,000 (Claim Not Started)\n• Health Insurance Policy: ₹5,00,000 Coverage (Policy Active)\n• Government Scheme / Benefit: ₹3,00,000 (Claim Pending)\n• Reliance / Jio Stocks: ₹2,00,000 (Confirmed)\n\n💳 Liabilities: ₹6,50,000 (2 Items)\n• Home Loan: ₹4,00,000 (Outstanding)\n• Vehicle Loan: ₹2,50,000 (Outstanding)\n\n🤝 Money to Recover: ₹1,10,000 (3 Items)\n• Rakesh: ₹30,000 (Recovery Pending)\n• Shreyansh: ₹30,000 (Recovery Pending)\n• Rahul + Anuj: ₹50,000 (Recovery Pending)',
    confidence: 0.95,
    suggestedActions: [
      'Life insurance ka claim kitna hai?',
      'Mere father ke kitne loans pending hain?',
      'Kaun kaun paise dena hai?',
      'Show total assets',
    ],
    safetyNotice: 'DEMO MODE: All information shown is sample demonstration data.',
  };
};

export const initializeDemoStorage = () => {
  localStorage.setItem('finclosure_is_demo', 'true');
  localStorage.setItem('finclosure_token', 'demo_session_token_xyz987');
  localStorage.setItem('finclosure_user', JSON.stringify(DEMO_USER));
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
  localStorage.removeItem('finclosure_demo_deceased');
  localStorage.removeItem('finclosure_demo_assets');
  localStorage.removeItem('finclosure_demo_documents');
  localStorage.removeItem('finclosure_demo_claims');
  localStorage.removeItem('finclosure_demo_notifications');
};
