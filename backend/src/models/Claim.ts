import mongoose, { Schema, Document } from 'mongoose';

export type ClaimStatus =
  | 'Not Started'
  | 'Documents Pending'
  | 'Ready to Submit'
  | 'Submitted'
  | 'Under Verification'
  | 'Approved'
  | 'Completed';

export interface IClaim extends Document {
  userId: mongoose.Types.ObjectId;
  deceasedId: mongoose.Types.ObjectId;
  assetId: mongoose.Types.ObjectId;
  institution: string;
  claimType: string;
  claimReferenceNumber?: string;
  status: ClaimStatus;
  overallProgress: number; // 0 to 100
  notes?: string;
  submittedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClaimSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deceasedId: { type: Schema.Types.ObjectId, ref: 'DeceasedProfile', required: true, index: true },
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
    institution: { type: String, required: true, trim: true },
    claimType: { type: String, required: true, trim: true },
    claimReferenceNumber: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        'Not Started',
        'Documents Pending',
        'Ready to Submit',
        'Submitted',
        'Under Verification',
        'Approved',
        'Completed',
      ],
      default: 'Not Started',
    },
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String, trim: true },
    submittedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Claim = mongoose.model<IClaim>('Claim', ClaimSchema);
