import mongoose, { Schema, Document } from 'mongoose';

export type StepStatus = 'Pending' | 'In Progress' | 'Completed' | 'Skipped';

export interface IClaimStep extends Document {
  claimId: mongoose.Types.ObjectId;
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
  relatedDocumentIds?: mongoose.Types.ObjectId[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimStepSchema: Schema = new Schema(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Skipped'],
      default: 'Pending',
    },
    relatedDocumentIds: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const ClaimStep = mongoose.model<IClaimStep>('ClaimStep', ClaimStepSchema);
