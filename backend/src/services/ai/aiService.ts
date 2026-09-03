import { env } from '../../config/env.js';
import { IAIServiceProvider } from './aiTypes.js';
import { GeminiAIProvider } from './geminiProvider.js';
import { FallbackAIProvider } from './fallbackProvider.js';

class AIService {
  private provider: IAIServiceProvider;
  public providerName: string;

  constructor() {
    if (env.AI_PROVIDER === 'gemini' && env.AI_API_KEY && env.AI_API_KEY.trim() !== '') {
      this.provider = new GeminiAIProvider(env.AI_API_KEY);
      this.providerName = 'Gemini AI';
    } else {
      this.provider = new FallbackAIProvider();
      this.providerName = 'Rule-based Heuristic AI Engine';
    }
  }

  public getProvider(): IAIServiceProvider {
    return this.provider;
  }
}

export const aiService = new AIService();
