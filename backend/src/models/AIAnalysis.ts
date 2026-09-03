import mongoose, { Schema, Document } from 'mongoose';

export type AIAnalysisType = 'asset_discovery' | 'document_extraction' | 'checklist_gen' | 'claim_guidance' | 'chat';

export interface IAIAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  deceasedId?: mongoose.Types.ObjectId;
  analysisType: AIAnalysisType;
  promptContext: string;
  aiResponse: any;
  confidenceScore?: number;
  providerUsed: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIAnalysisSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deceasedId: { type: Schema.Types.ObjectId, ref: 'DeceasedProfile' },
    analysisType: {
      type: String,
      enum: ['asset_discovery', 'document_extraction', 'checklist_gen', 'claim_guidance', 'chat'],
      required: true,
    },
    promptContext: { type: String, required: true },
    aiResponse: { type: Schema.Types.Mixed, required: true },
    confidenceScore: { type: Number },
    providerUsed: { type: String, default: 'gemini' },
  },
  { timestamps: true }
);

export const AIAnalysis = mongoose.model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
