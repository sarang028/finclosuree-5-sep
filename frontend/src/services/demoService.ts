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
  notes: '[DEMO DATA] Deceased profile preloaded for instant hackathon demonstration.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_ASSETS: Asset[] = [
  {
    _id: 'demo_asset_1',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'HDFC Savings Account',
    category: 'Bank Account',
    institution: 'HDFC Bank',
    accountOrPolicyNumber: '50100239481234',
    estimatedValue: 450000,
    status: 'Confirmed',
    notes: '[DEMO DATA] Primary savings account at HDFC Powai branch. Passbook verified.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_2',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'SBI Term Deposit (FD)',
    category: 'Fixed Deposit',
    institution: 'State Bank of India (SBI)',
    accountOrPolicyNumber: '39201938210',
    estimatedValue: 1200000,
    status: 'Confirmed',
    notes: '[DEMO DATA] 3-Year Special Term Deposit maturing Oct 2026.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_3',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'LIC Jeevan Anand Life Policy',
    category: 'Insurance',
    institution: 'Life Insurance Corporation of India (LIC)',
    accountOrPolicyNumber: '849201948',
    estimatedValue: 2500000,
    status: 'Claim Started',
    notes: '[DEMO DATA] LIC Jeevan Anand Endowment Policy with Sum Assured ₹25 Lakhs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_4',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'Zerodha Mutual Funds Portfolio',
    category: 'Investment',
    institution: 'Zerodha Broking',
    accountOrPolicyNumber: 'ZRD-982104',
    estimatedValue: 875000,
    status: 'Potential',
    notes: '[DEMO DATA] Discovered via GenAI email note scan: ICICI Prudential & HDFC Top 100 funds.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_asset_5',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'HDFC Home Loan Credit Protect Insurance',
    category: 'Other',
    institution: 'HDFC Ltd',
    accountOrPolicyNumber: 'HL-948201',
    estimatedValue: 1500000,
    status: 'Known',
    notes: '[DEMO DATA] Outstanding balance ₹15 Lakhs covered under Credit Protect Term Insurance.',
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
      summary: 'Municipal Death Certificate for Late Rajesh Sharma issued Jan 2026',
      extractedNames: ['Rajesh Sharma', 'Ankit Sharma'],
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
    name: 'PAN_Card_Rajesh_Sharma.jpg',
    category: 'Identity Proof',
    fileUrl: '/demo_pan_card.jpg',
    fileKey: 'demo_pan_key',
    mimeType: 'image/jpeg',
    size: 524288,
    status: 'Reviewed',
    extractedData: {
      summary: 'Permanent Account Number identity card verified',
      extractedNames: ['Rajesh Sharma'],
      extractedNumbers: ['ABCPS1234F'],
      confidenceScore: 0.99,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'demo_doc_3',
    userId: 'demo_user_123',
    deceasedId: 'demo_deceased_1',
    name: 'LIC_Jeevan_Anand_Policy_Bond.pdf',
    category: 'Insurance Document',
    fileUrl: '/demo_lic_bond.pdf',
    fileKey: 'demo_lic_key',
    mimeType: 'application/pdf',
    size: 2097152,
    status: 'Reviewed',
    extractedData: {
      summary: 'LIC Jeevan Anand Original Policy Bond #849201948',
      extractedNames: ['Rajesh Sharma', 'Ankit Sharma'],
      extractedNumbers: ['849201948', '2500000'],
      confidenceScore: 0.96,
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
    status: 'Under Verification',
    overallProgress: 75,
    notes: '[DEMO DATA] Submitted at LIC Branch 893, Fort, Mumbai. Under final division verification.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_CLAIM_STEPS: ClaimStep[] = [
  { _id: 'step_1', claimId: 'demo_claim_1', stepNumber: 1, title: 'Document Review', description: 'Gather & verify death cert, policy bond, nominee ID', status: 'Completed' },
  { _id: 'step_2', claimId: 'demo_claim_1', stepNumber: 2, title: 'Collect Required Forms', description: 'Obtain Form 3783 (Claimant Statement) & Form 3801', status: 'Completed' },
  { _id: 'step_3', claimId: 'demo_claim_1', stepNumber: 3, title: 'Fill & Attest Forms', description: 'Fill nominee bank details with cancelled cheque', status: 'Completed' },
  { _id: 'step_4', claimId: 'demo_claim_1', stepNumber: 4, title: 'Branch Submission', description: 'Physical submission at LIC Branch Office', status: 'Completed' },
  { _id: 'step_5', claimId: 'demo_claim_1', stepNumber: 5, title: 'Divisional Verification', description: 'Verification by LIC Claims Inspection Officer', status: 'In Progress' },
  { _id: 'step_6', claimId: 'demo_claim_1', stepNumber: 6, title: 'NEFT Settlement', description: 'Direct bank credit of ₹25,00,000 to Nominee Account', status: 'Pending' },
];

export const DEMO_CHECKLIST: ChecklistItem[] = [
  { _id: 'chk_1', claimId: 'demo_claim_1', name: 'Death Certificate', explanation: 'Original Death Certificate issued by Municipal Corporation', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[0] },
  { _id: 'chk_2', claimId: 'demo_claim_1', name: 'LIC Policy Bond', explanation: 'Original LIC Policy Bond Document', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[2] },
  { _id: 'chk_3', claimId: 'demo_claim_1', name: 'Nominee Identity Proof', explanation: 'Claimant PAN Card & Aadhaar Card Identity Proof', isRequired: true, isCompleted: true, associatedDocumentId: DEMO_DOCUMENTS[1] },
  { _id: 'chk_4', claimId: 'demo_claim_1', name: 'Bank NEFT Mandate', explanation: 'Claimant Cancelled Cheque & Bank Passbook Copy (for NEFT)', isRequired: true, isCompleted: true },
  { _id: 'chk_5', claimId: 'demo_claim_1', name: 'LIC Form 3783', explanation: 'Filled & Signed LIC Form 3783 (Claimant Statement)', isRequired: true, isCompleted: true },
  { _id: 'chk_6', claimId: 'demo_claim_1', name: 'Verification Officer Stamp', explanation: 'Official Verification Officer Sign-off Stamp', isRequired: true, isCompleted: false },
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: 'notif_1',
    userId: 'demo_user_123',
    title: '[DEMO] LIC Claim Status Updated',
    message: 'Your LIC Claim #LIC-CLAIM-2026-9812 has moved to Divisional Verification stage.',
    type: 'status_change',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'notif_2',
    userId: 'demo_user_123',
    title: '[DEMO] GenAI Asset Discovery Alert',
    message: 'GenAI engine detected 1 unconfirmed Zerodha Mutual Fund account (₹8.75 Lakhs).',
    type: 'ai_discovery',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_DASHBOARD: DashboardData = {
  activeDeceasedProfile: DEMO_DECEASED,
  allDeceasedProfiles: [DEMO_DECEASED],
  stats: {
    totalAssets: 5,
    potentialAssets: 1,
    confirmedAssets: 2,
    activeClaims: 1,
    completedClaims: 0,
    pendingDocuments: 1,
    closureProgressPercentage: 68,
  },
  attentionItems: [
    {
      id: 'att_1',
      type: 'warning',
      title: 'Action Needed: LIC Divisional Verification',
      message: 'LIC Officer is verifying your bank mandate and cancelled cheque.',
      actionLabel: 'View Claim Tracker',
      link: '/claims',
    },
  ],
  recentActivity: [
    {
      _id: 'act_1',
      action: 'LIC Policy document reviewed by GenAI',
      entityType: 'Document',
      details: 'Extracted Policy #849201948 with Sum Assured ₹25,00,000',
      createdAt: new Date().toISOString(),
    },
  ],
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
