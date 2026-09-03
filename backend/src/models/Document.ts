import mongoose, { Schema, Document } from 'mongoose';

export type DocumentCategory =
  | 'Death Certificate'
  | 'Identity Proof'
  | 'Nominee Proof'
  | 'Legal Heir Proof'
  | 'Bank Document'
  | 'Insurance Document'
  | 'Investment Document'
  | 'Pension Document'
  | 'Claim Form'
  | 'Other';

export type DocumentStatus = 'Uploaded' | 'Processing' | 'Reviewed' | 'Needs Attention';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  deceasedId: mongoose.Types.ObjectId;
  assetId?: mongoose.Types.ObjectId;
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  fileKey: string;
  mimeType: string;
  size: number;
  status: DocumentStatus;
  extractedData?: {
    summary?: string;
    extractedNames?: string[];
    extractedNumbers?: string[];
    datesFound?: string[];
    missingFields?: string[];
    confidenceScore?: number;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    deceasedId: { type: Schema.Types.ObjectId, ref: 'DeceasedProfile', required: true, index: true },
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset' },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'Death Certificate',
        'Identity Proof',
        'Nominee Proof',
        'Legal Heir Proof',
        'Bank Document',
        'Insurance Document',
        'Investment Document',
        'Pension Document',
        'Claim Form',
        'Other',
      ],
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileKey: { type: String, required: true },
    mimeType: { type: String, default: 'application/pdf' },
    size: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Uploaded', 'Processing', 'Reviewed', 'Needs Attention'],
      default: 'Uploaded',
    },
    extractedData: {
      summary: { type: String },
      extractedNames: [{ type: String }],
      extractedNumbers: [{ type: String }],
      datesFound: [{ type: String }],
      missingFields: [{ type: String }],
      confidenceScore: { type: Number },
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export const DocumentModel = mongoose.model<IDocument>('Document', DocumentSchema);
