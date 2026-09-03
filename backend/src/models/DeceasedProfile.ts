import mongoose, { Schema, Document } from 'mongoose';

export interface IDeceasedProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  relationship: string; // e.g. Father, Mother, Spouse, Sibling, Relative, Other
  claimantRole: 'Nominee' | 'Legal Heir' | 'Both' | 'Other';
  contactInfo?: string;
  knownInstitutions?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeceasedProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
    relationship: { type: String, required: true, trim: true },
    claimantRole: { type: String, enum: ['Nominee', 'Legal Heir', 'Both', 'Other'], default: 'Nominee' },
    contactInfo: { type: String, trim: true },
    knownInstitutions: [{ type: String, trim: true }],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const DeceasedProfile = mongoose.model<IDeceasedProfile>('DeceasedProfile', DeceasedProfileSchema);
