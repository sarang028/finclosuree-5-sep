export interface DiscoveredAssetResult {
  category: 'Bank Account' | 'Fixed Deposit' | 'Insurance' | 'Investment' | 'Pension' | 'Digital Asset' | 'Other';
  institution: string;
  accountOrPolicyNumber?: string;
  estimatedValue?: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  evidence: string;
  whyIdentified: string;
  recommendedAction: string;
}

export interface DocumentAnalysisResult {
  summary: string;
  categorySuggested: string;
  extractedNames: string[];
  extractedNumbers: string[];
  datesFound: string[];
  missingFields: string[];
  confidenceScore: number;
  warnings?: string[];
}

export interface ChecklistItemResult {
  name: string;
  explanation: string;
  isRequired: boolean;
  suggestedCategory: string;
}

export interface ClaimGuidanceResult {
  currentStepTitle: string;
  explanation: string;
  preparationAdvice: string[];
  requiredDocuments: string[];
  nextAction: string;
  missingInformation: string[];
  safetyNotice: string;
}

export interface ChatResponseResult {
  reply: string;
  suggestedActions?: string[];
  referencedAssets?: string[];
  safetyNotice: string;
}

export interface IAIServiceProvider {
  discoverAssets(context: {
    deceasedName: string;
    knownText: string;
    documentSummaries?: string[];
  }): Promise<DiscoveredAssetResult[]>;

  analyzeDocument(context: {
    fileName: string;
    fileCategory?: string;
    textContent?: string;
    deceasedName?: string;
  }): Promise<DocumentAnalysisResult>;

  generateChecklist(context: {
    assetCategory: string;
    institution: string;
    claimantRole: string;
    knownDocuments: string[];
  }): Promise<ChecklistItemResult[]>;

  getClaimGuidance(context: {
    assetCategory: string;
    institution: string;
    claimStatus: string;
    stepTitle: string;
    claimantRole: string;
    availableDocuments: string[];
  }): Promise<ClaimGuidanceResult>;

  chatWithContext(context: {
    userQuery: string;
    language?: string;
    deceasedProfile?: any;
    assetsSummary?: any[];
    documentsSummary?: any[];
    claimsSummary?: any[];
  }): Promise<ChatResponseResult>;
}
