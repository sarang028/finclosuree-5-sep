export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  provider?: 'local' | 'google' | 'both';
  googleId?: string;
  avatar?: string;
}

export interface DeceasedProfile {
  _id: string;
  userId: string;
  fullName: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  relationship: string;
  claimantRole: 'Nominee' | 'Legal Heir' | 'Both' | 'Other';
  contactInfo?: string;
  knownInstitutions?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type RecordType = 'Asset' | 'Liability' | 'Money to Recover';

export type AssetCategory =
  | 'Bank Account'
  | 'Fixed Deposit'
  | 'Insurance'
  | 'Health Insurance'
  | 'Investment'
  | 'Stocks'
  | 'Government Scheme'
  | 'Pension'
  | 'Digital Asset'
  | 'Home Loan'
  | 'Vehicle Loan'
  | 'Friend/Relative Loan'
  | 'Personal Loan'
  | 'Liability'
  | 'Money to Recover'
  | 'Other';

export type AssetStatus =
  | 'Known'
  | 'Potential'
  | 'Confirmed'
  | 'Claim Ready'
  | 'Claim Started'
  | 'Claim Not Started'
  | 'Policy Active / Claim Guidance Available'
  | 'Eligibility/Claim Pending'
  | 'Documentation Required'
  | 'Outstanding'
  | 'Recovery Pending'
  | 'Completed'
  | 'Claim Completed';

export interface Asset {
  _id: string;
  userId: string;
  deceasedId: string;
  name: string;
  category: AssetCategory;
  recordType?: RecordType;
  institution: string;
  accountOrPolicyNumber?: string;
  estimatedValue: number;
  currency?: string;
  status: AssetStatus;
  notes?: string;
  isAiDiscovered?: boolean;
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  evidence?: string;
  recommendedAction?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentCategory =
  | 'Death Certificate'
  | 'Identity Proof'
  | 'Nominee Proof'
  | 'Legal Heir Proof'
  | 'Bank Document'
  | 'Insurance Document'
  | 'Investment Document'
  | 'Pension Document'
  | 'Claim Form'
  | 'Other';

export type DocumentStatus = 'Uploaded' | 'Processing' | 'Reviewed' | 'Needs Attention';

export interface DocumentItem {
  _id: string;
  userId: string;
  deceasedId: string;
  assetId?: string;
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  fileKey: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  extractedData?: {
    summary?: string;
    extractedNames?: string[];
    extractedNumbers?: string[];
    datesFound?: string[];
    missingFields?: string[];
    confidenceScore?: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus =
  | 'Not Started'
  | 'Documents Pending'
  | 'Ready to Submit'
  | 'Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Completed';

export interface Claim {
  _id: string;
  userId: string;
  deceasedId: DeceasedProfile | string;
  assetId: Asset | string;
  institution: string;
  claimType: string;
  claimReferenceNumber?: string;
  status: ClaimStatus;
  overallProgress: number;
  notes?: string;
  submittedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimStep {
  _id: string;
  claimId: string;
  stepNumber: number;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Skipped';
  completedAt?: string;
}

export interface ChecklistItem {
  _id: string;
  claimId: string;
  name: string;
  explanation: string;
  isRequired: boolean;
  isCompleted: boolean;
  associatedDocumentId?: DocumentItem | string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'action_required' | 'status_change' | 'ai_discovery';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  activeDeceasedProfile?: DeceasedProfile;
  allDeceasedProfiles: DeceasedProfile[];
  stats: {
    totalAssets: number;
    totalAssetsValue?: number;
    totalLiabilitiesCount?: number;
    totalLiabilitiesValue?: number;
    totalRecoverableCount?: number;
    totalRecoverableValue?: number;
    potentialAssets: number;
    confirmedAssets: number;
    activeClaims: number;
    completedClaims: number;
    pendingDocuments: number;
    closureProgressPercentage: number;
  };
  attentionItems: Array<{
    id: string;
    type: 'warning' | 'action' | 'success' | 'info';
    title: string;
    message: string;
    actionLabel: string;
    link: string;
  }>;
  recentActivity: Array<{
    _id: string;
    action: string;
    entityType: string;
    details?: string;
    createdAt: string;
  }>;
}

export interface AiDiscoveredAsset {
  category: AssetCategory;
  institution: string;
  accountOrPolicyNumber?: string;
  estimatedValue?: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  evidence: string;
  whyIdentified: string;
  recommendedAction: string;
}
