import mongoose, { Schema, Document } from 'mongoose';

export type AssetCategory =
  | 'Bank Account'
  | 'Fixed Deposit'
  | 'Insurance'
  | 'Investment'
  | 'Pension'
  | 'Digital Asset'
  | 'Other';

export type AssetStatus = 'Known' | 'Potential' | 'Confirmed' | 'Claim Started' | 'Claim Completed';

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId;
  deceasedId: mongoose.Types.ObjectId;
  name: string;
  category: AssetCategory;
  institution: string;
  accountOrPolicyNumber?: string;
  estimatedValue?: number;
  currency?: string;
  status: AssetStatus;
  notes?: string;
  isAiDiscovered: boolean;
  confidenceLevel?: 'High' | 'Medium' | 'Low';
  evidence?: string;
  recommendedAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deceasedId: { type: Schema.Types.ObjectId, ref: 'DeceasedProfile', required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Bank Account', 'Fixed Deposit', 'Insurance', 'Investment', 'Pension', 'Digital Asset', 'Other'],
      required: true,
    },
    institution: { type: String, required: true, trim: true },
    accountOrPolicyNumber: { type: String, trim: true },
    estimatedValue: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['Known', 'Potential', 'Confirmed', 'Claim Started', 'Claim Completed'],
      default: 'Known',
    },
    notes: { type: String, trim: true },
    isAiDiscovered: { type: Boolean, default: false },
    confidenceLevel: { type: String, enum: ['High', 'Medium', 'Low'] },
    evidence: { type: String, trim: true },
    recommendedAction: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Asset = mongoose.model<IAsset>('Asset', AssetSchema);
