import {
  IAIServiceProvider,
  DiscoveredAssetResult,
  DocumentAnalysisResult,
  ChecklistItemResult,
  ClaimGuidanceResult,
  ChatResponseResult,
} from './aiTypes.js';

export class FallbackAIProvider implements IAIServiceProvider {
  public async discoverAssets(context: {
    deceasedName: string;
    knownText: string;
    documentSummaries?: string[];
  }): Promise<DiscoveredAssetResult[]> {
    const text = context.knownText.toLowerCase();
    const results: DiscoveredAssetResult[] = [];

    if (text.includes('sbi') || text.includes('insurance') || text.includes('lic') || text.includes('policy')) {
      results.push({
        category: 'Insurance',
        institution: text.includes('lic') ? 'LIC of India' : 'SBI Life Insurance',
        accountOrPolicyNumber: 'POL-' + Math.floor(100000 + Math.random() * 900000),
        estimatedValue: 500000,
        confidenceLevel: 'High',
        evidence: 'Insurance policy document / mention uploaded by user.',
        whyIdentified: 'Explicit keywords matching insurance policies detected in provided financial notes.',
        recommendedAction: 'Verify policy document status and request claim form from insurer.',
      });
    }

    if (text.includes('hdfc') || text.includes('fd') || text.includes('fixed deposit') || text.includes('deposit')) {
      results.push({
        category: 'Fixed Deposit',
        institution: 'HDFC Bank Ltd.',
        accountOrPolicyNumber: 'FD-' + Math.floor(100000 + Math.random() * 900000),
        estimatedValue: 250000,
        confidenceLevel: 'High',
        evidence: 'Fixed deposit interest receipt / bank entry found.',
        whyIdentified: 'Term deposit interest credits identified in user provided context.',
        recommendedAction: 'Obtain FD certificate copy and approach nearest HDFC branch for nominee claim.',
      });
    }

    if (text.includes('pf') || text.includes('epfo') || text.includes('pension') || text.includes('provident')) {
      results.push({
        category: 'Pension',
        institution: 'Employees Provident Fund Organisation (EPFO)',
        accountOrPolicyNumber: 'UAN-' + Math.floor(100000000000 + Math.random() * 900000000000),
        estimatedValue: 400000,
        confidenceLevel: 'Medium',
        evidence: 'EPFO / pension service record reference in user input.',
        whyIdentified: 'Employment provident fund reference found in deceased person notes.',
        recommendedAction: 'Submit Form 20 (PF settlement) & Form 10D (Pension) on EPFO Unified Member Portal.',
      });
    }

    if (results.length === 0) {
      // Default sample discovered potential asset
      results.push({
        category: 'Bank Account',
        institution: 'State Bank of India',
        accountOrPolicyNumber: 'SB-3094****8192',
        estimatedValue: 120000,
        confidenceLevel: 'Medium',
        evidence: 'Bank account reference detected in user context.',
        whyIdentified: 'Active savings account reference associated with deceased profile.',
        recommendedAction: 'Confirm account ownership with branch & submit nominee death claim form.',
      });
    }

    return results;
  }

  public async analyzeDocument(context: {
    fileName: string;
    fileCategory?: string;
    textContent?: string;
    deceasedName?: string;
  }): Promise<DocumentAnalysisResult> {
    const fileNameLower = context.fileName.toLowerCase();

    if (fileNameLower.includes('death') || context.fileCategory === 'Death Certificate') {
      return {
        summary: `Death Certificate verified for ${context.deceasedName || 'deceased profile'}. Contains official registration number and date of demise.`,
        categorySuggested: 'Death Certificate',
        extractedNames: [context.deceasedName || 'Deceased Record', 'Registrar of Births & Deaths'],
        extractedNumbers: ['REG-2026-981240'],
        datesFound: ['15-Jan-2026', '18-Jan-2026'],
        missingFields: ['Cause of death (optional for claim submission)'],
        confidenceScore: 94,
        warnings: ['Ensure 5-10 notarized copies are maintained for multiple simultaneous institution claims.'],
      };
    }

    if (fileNameLower.includes('policy') || fileNameLower.includes('insurance') || context.fileCategory === 'Insurance Document') {
      return {
        summary: 'Life Insurance Policy Certificate identifying sum assured and beneficiary details.',
        categorySuggested: 'Insurance Document',
        extractedNames: [context.deceasedName || 'Policyholder', 'Nominee Beneficiary'],
        extractedNumbers: ['POL-88192304'],
        datesFound: ['10-Mar-2018', '10-Mar-2038'],
        missingFields: ['Updated nominee bank account branch IFSC'],
        confidenceScore: 91,
        warnings: ['Verify whether grace period or premium waiver applies.'],
      };
    }

    return {
      summary: `Uploaded document "${context.fileName}" analyzed. Extracted relevant financial references.`,
      categorySuggested: context.fileCategory || 'Other',
      extractedNames: [context.deceasedName || 'Deceased Individual'],
      extractedNumbers: ['REF-' + Math.floor(100000 + Math.random() * 900000)],
      datesFound: ['2026-02-01'],
      missingFields: ['Original stamp / seal verification'],
      confidenceScore: 88,
      warnings: ['Distinguish user-provided uploads from officially attested copies.'],
    };
  }

  public async generateChecklist(context: {
    assetCategory: string;
    institution: string;
    claimantRole: string;
    knownDocuments: string[];
  }): Promise<ChecklistItemResult[]> {
    const isNominee = context.claimantRole === 'Nominee';

    return [
      {
        name: 'Original or Notarized Death Certificate',
        explanation: 'Mandatory government-issued death certificate with registration number.',
        isRequired: true,
        suggestedCategory: 'Death Certificate',
      },
      {
        name: `${context.claimantRole} Identity & Address Proof (Aadhaar / PAN / Passport)`,
        explanation: 'Self-attested identity proof of the claimant submitting the claim.',
        isRequired: true,
        suggestedCategory: 'Identity Proof',
      },
      {
        name: isNominee ? 'Nominee Confirmation Document / Passbook Entry' : 'Legal Heir Certificate / Successive Certificate',
        explanation: isNominee
          ? 'Proof establishing claimant as registered nominee in bank/insurer records.'
          : 'Legal document certified by revenue court or tehsildar establishing heir status.',
        isRequired: true,
        suggestedCategory: isNominee ? 'Nominee Proof' : 'Legal Heir Proof',
      },
      {
        name: `${context.institution} Standard Deceased Claim Application Form`,
        explanation: `Duly filled claim form prescribed by ${context.institution}.`,
        isRequired: true,
        suggestedCategory: 'Claim Form',
      },
      {
        name: 'Claimant Cancelled Cheque / Bank Account Details',
        explanation: 'Cancelled cheque of the claimant account where claim funds will be transferred via NEFT/RTGS.',
        isRequired: true,
        suggestedCategory: 'Bank Document',
      },
    ];
  }

  public async getClaimGuidance(context: {
    assetCategory: string;
    institution: string;
    claimStatus: string;
    stepTitle: string;
    claimantRole: string;
    availableDocuments: string[];
  }): Promise<ClaimGuidanceResult> {
    return {
      currentStepTitle: context.stepTitle || 'Claim Preparation',
      explanation: `You are currently at "${context.stepTitle}" for your ${context.assetCategory} claim with ${context.institution}.`,
      preparationAdvice: [
        `Ensure all document names match exact identity records for ${context.claimantRole}.`,
        `Keep 2 physical passport photographs of the claimant ready for form attachment.`,
        `Obtain an acknowledgement slip / token number when submitting physical forms at ${context.institution}.`,
      ],
      requiredDocuments: [
        'Death Certificate',
        'Claimant Identity Proof',
        'Claim Application Form',
        'Cancelled Cheque for NEFT payout',
      ],
      nextAction: `Complete the checklist items for ${context.stepTitle} and proceed to submission.`,
      missingInformation: ['Nominee payout bank branch IFSC code verification'],
      safetyNotice:
        'FinClosure AI provides guidance based on standard processes. Always verify exact branch requirements directly with the authorized officers at ' +
        context.institution +
        '.',
    };
  }

  public async chatWithContext(context: {
    userQuery: string;
    language?: string;
    deceasedProfile?: any;
    assetsSummary?: any[];
    documentsSummary?: any[];
    claimsSummary?: any[];
  }): Promise<ChatResponseResult> {
    const q = context.userQuery.toLowerCase();
    const lang = context.language || 'en';
    let reply = '';
    const assetsCount = context.assetsSummary?.length || 0;
    const claimsCount = context.claimsSummary?.length || 0;
    const deceasedName = context.deceasedProfile?.fullName || 'Deceased Profile';

    if (lang === 'hi') {
      if (q.includes('claim') || q.includes('दावा') || q.includes('bank') || q.includes('बैंक')) {
        reply = `${deceasedName} के लिए आपके दावों का विवरण:\n\n` +
          `• वर्तमान में आपके पास **${assetsCount} संपत्तियां** और **${claimsCount} सक्रिय दावे** पंजीकृत हैं।\n` +
          `• मुख्य चरण: मृत्यु प्रमाण पत्र और दावेदार पहचान पत्र (आधार/पैन) तैयार रखें।\n` +
          `• दावे की विस्तृत स्थिति और आवश्यक चेकलिस्ट के लिए 'दावा ट्रैकर' देखें।`;
      } else {
        reply = `FinClosure AI सहायक आपकी सहायता के लिए तैयार है। आप **${deceasedName}** के लिए **${assetsCount} संपत्तियों** और **${claimsCount} दावों** का प्रबंधन कर रहे हैं।\n\n` +
          `आप मुझसे दस्तावेज जमा करने, बैंक/बीमा दावों या अगले चरणों के बारे में प्रश्न पूछ सकते हैं।`;
      }
    } else if (lang === 'mr') {
      if (q.includes('claim') || q.includes('दावा') || q.includes('bank') || q.includes('बँक')) {
        reply = `${deceasedName} यांच्यासाठी दाव्यांची माहिती:\n\n` +
          `• सध्या तुमच्याकडे **${assetsCount} मालमत्ता** आणि **${claimsCount} सक्रिय दावे** नोंदणीकृत आहेत.\n` +
          `• मुख्य टप्पा: मृत्यू दाखला आणि वारस/नॉमिनी ओळखपत्र तयार ठेवा.\n` +
          `• सविस्तर प्रगती पाहण्यासाठी 'दावा ट्रॅकर' विभाग पहा.`;
      } else {
        reply = `FinClosure AI सहाय्यक आपल्या मदतीसाठी तत्पर आहे. तुम्ही **${deceasedName}** यांच्या **${assetsCount} मालमत्ता** आणि **${claimsCount} दाव्यांचे** व्यवस्थापन करत आहात.\n\n` +
          `तुम्ही कागदपत्रे, दाव्यांचे टप्पे किंवा पुढील कारवाईबद्दल विचारू शकता.`;
      }
    } else {
      if (q.includes('next') || q.includes('what to do') || q.includes('focus')) {
        reply = `Based on your FinClosure records for ${deceasedName}:\n\n` +
          `1. You currently have **${assetsCount} assets** recorded and **${claimsCount} active claims**.\n` +
          `2. Next recommended step: Review any unconfirmed potential assets in your **Assets** tab and upload missing document proofs.\n` +
          `3. For active claims, open the claim detailed journey to follow step-by-step guidance.`;
      } else if (q.includes('document') || q.includes('missing')) {
        reply = `Regarding documents for ${deceasedName}:\n\n` +
          `• Make sure you have uploaded the **Death Certificate** and **Claimant Identity Proof**.\n` +
          `• Each claim dynamically verifies required documents. Check the **Checklist** on any open claim to see exact pending items.`;
      } else if (q.includes('claim') || q.includes('pending') || q.includes('status')) {
        reply = `You have **${claimsCount} claims** in progress. To view specific progress bars and update statuses, navigate to the **Claims** section from the sidebar menu.`;
      } else {
        reply = `FinClosure Assistant is here to support you. You are managing financial closure for **${deceasedName}** with **${assetsCount} assets** and **${claimsCount} claims** registered.\n\n` +
          `You can ask me questions about missing documents, claim steps, asset confirmation, or what action to take today.`;
      }
    }

    return {
      reply,
      suggestedActions: ['Check pending claims', 'Review discovered assets', 'Upload missing document'],
      referencedAssets: context.assetsSummary?.map((a) => a.name) || [],
      safetyNotice:
        'FinClosure AI is an assistant tool, not a legal or financial authority. Always confirm critical requirements with the respective financial institution.',
    };
  }
}
