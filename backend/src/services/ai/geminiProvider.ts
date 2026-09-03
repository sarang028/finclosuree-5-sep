import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  IAIServiceProvider,
  DiscoveredAssetResult,
  DocumentAnalysisResult,
  ChecklistItemResult,
  ClaimGuidanceResult,
  ChatResponseResult,
} from './aiTypes.js';
import { FallbackAIProvider } from './fallbackProvider.js';

export class GeminiAIProvider implements IAIServiceProvider {
  private ai?: GoogleGenerativeAI;
  private fallback: FallbackAIProvider;

  constructor(apiKey?: string) {
    this.fallback = new FallbackAIProvider();
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.ai = new GoogleGenerativeAI(apiKey);
      } catch (err) {
        console.warn('[Gemini AI] Initialization warning:', err);
      }
    }
  }

  public async discoverAssets(context: {
    deceasedName: string;
    knownText: string;
    documentSummaries?: string[];
  }): Promise<DiscoveredAssetResult[]> {
    if (!this.ai) return this.fallback.discoverAssets(context);

    try {
      const prompt = `You are a financial asset discovery AI for legal heirs/nominees. Analyze the following text and document notes for deceased person "${context.deceasedName}":
      
      "${context.knownText}"
      Document Summaries: ${context.documentSummaries?.join('; ') || 'None'}
      
      Identify potential financial assets (Bank Account, Fixed Deposit, Insurance, Investment, Pension, Digital Asset, Other).
      CRITICAL RULE: DO NOT FABRICATE ASSETS. Only extract assets indicated by explicit or contextual evidence in the text.
      
      Return JSON array of objects with schema:
      [
        {
          "category": "Bank Account" | "Fixed Deposit" | "Insurance" | "Investment" | "Pension" | "Digital Asset" | "Other",
          "institution": "string",
          "accountOrPolicyNumber": "string",
          "estimatedValue": number,
          "confidenceLevel": "High" | "Medium" | "Low",
          "evidence": "string",
          "whyIdentified": "string",
          "recommendedAction": "string"
        }
      ]`;

      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.error('[Gemini AI Error] discoverAssets failed, switching to fallback provider:', err);
    }
    return this.fallback.discoverAssets(context);
  }

  public async analyzeDocument(context: {
    fileName: string;
    fileCategory?: string;
    textContent?: string;
    deceasedName?: string;
  }): Promise<DocumentAnalysisResult> {
    if (!this.ai) return this.fallback.analyzeDocument(context);

    try {
      const prompt = `Analyze this financial or legal document uploaded for deceased profile "${context.deceasedName || 'Unknown'}":
      Filename: ${context.fileName}
      Suggested Category: ${context.fileCategory || 'Unknown'}
      Extracted Text Snippets: "${context.textContent || 'N/A'}"
      
      Return a JSON object with schema:
      {
        "summary": "string",
        "categorySuggested": "string",
        "extractedNames": ["string"],
        "extractedNumbers": ["string"],
        "datesFound": ["string"],
        "missingFields": ["string"],
        "confidenceScore": number (0-100),
        "warnings": ["string"]
      }`;

      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.error('[Gemini AI Error] analyzeDocument failed, switching to fallback provider:', err);
    }
    return this.fallback.analyzeDocument(context);
  }

  public async generateChecklist(context: {
    assetCategory: string;
    institution: string;
    claimantRole: string;
    knownDocuments: string[];
  }): Promise<ChecklistItemResult[]> {
    if (!this.ai) return this.fallback.generateChecklist(context);

    try {
      const prompt = `Generate a personalized document submission checklist for a financial claim:
      Asset Category: ${context.assetCategory}
      Institution: ${context.institution}
      Claimant Role: ${context.claimantRole}
      Already uploaded documents: ${context.knownDocuments.join(', ')}
      
      Return JSON array of items:
      [
        {
          "name": "string",
          "explanation": "string",
          "isRequired": boolean,
          "suggestedCategory": "string"
        }
      ]`;

      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.error('[Gemini AI Error] generateChecklist failed, switching to fallback:', err);
    }
    return this.fallback.generateChecklist(context);
  }

  public async getClaimGuidance(context: {
    assetCategory: string;
    institution: string;
    claimStatus: string;
    stepTitle: string;
    claimantRole: string;
    availableDocuments: string[];
  }): Promise<ClaimGuidanceResult> {
    if (!this.ai) return this.fallback.getClaimGuidance(context);

    try {
      const prompt = `Provide compassionate, clear step-by-step guidance for a nominee claiming financial assets:
      Asset Category: ${context.assetCategory}
      Institution: ${context.institution}
      Current Step: ${context.stepTitle}
      Claim Status: ${context.claimStatus}
      Claimant Role: ${context.claimantRole}
      Available Documents: ${context.availableDocuments.join(', ')}
      
      Return JSON object:
      {
        "currentStepTitle": "string",
        "explanation": "string",
        "preparationAdvice": ["string"],
        "requiredDocuments": ["string"],
        "nextAction": "string",
        "missingInformation": ["string"],
        "safetyNotice": "string"
      }`;

      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.error('[Gemini AI Error] getClaimGuidance failed, switching to fallback:', err);
    }
    return this.fallback.getClaimGuidance(context);
  }

  public async chatWithContext(context: {
    userQuery: string;
    language?: string;
    deceasedProfile?: any;
    assetsSummary?: any[];
    documentsSummary?: any[];
    claimsSummary?: any[];
  }): Promise<ChatResponseResult> {
    if (!this.ai) return this.fallback.chatWithContext(context);

    try {
      const prompt = `You are FinClosure AI Assistant. Answer the user's question using their financial closure context:
      User Query: "${context.userQuery}"
      Requested Language: "${context.language || 'en'}"
      Deceased Profile: ${JSON.stringify(context.deceasedProfile || {})}
      Assets Context: ${JSON.stringify(context.assetsSummary || [])}
      Documents Context: ${JSON.stringify(context.documentsSummary || [])}
      Claims Context: ${JSON.stringify(context.claimsSummary || [])}

      IMPORTANT RULES:
      - RESPOND EXCLUSIVELY IN THE REQUESTED LANGUAGE ("${context.language || 'en'}"). If language is 'hi', respond in Hindi; if 'mr', respond in Marathi; if 'en', respond in English.
      - Use empathetic, professional, trustworthy language.
      - Never fabricate financial institution rules or claim requirements.
      - Remind the user to verify exact policies with official institutions.

      Return JSON object:
      {
        "reply": "string",
        "suggestedActions": ["string"],
        "referencedAssets": ["string"],
        "safetyNotice": "string"
      }`;

      const model = this.ai.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.error('[Gemini AI Error] chatWithContext failed, switching to fallback:', err);
    }
    return this.fallback.chatWithContext(context);
  }
}
