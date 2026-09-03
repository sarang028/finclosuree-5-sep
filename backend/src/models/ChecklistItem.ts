import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklistItem extends Document {
  claimId: mongoose.Types.ObjectId;
  name: string;
  explanation: string;
  isRequired: boolean;
  isCompleted: boolean;
  associatedDocumentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema: Schema = new Schema(
  {
    claimId: { type: Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
    name: { type: String, required: true, trim: true },
    explanation: { type: String, required: true, trim: true },
    isRequired: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    associatedDocumentId: { type: Schema.Types.ObjectId, ref: 'Document' },
  },
  { timestamps: true }
);

export const ChecklistItem = mongoose.model<IChecklistItem>('ChecklistItem', ChecklistItemSchema);
