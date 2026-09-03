import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string; // e.g. USER_LOGIN, ASSET_CREATE, ASSET_CONFIRM, DOCUMENT_UPLOAD, CLAIM_STATUS_CHANGE
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, trim: true },
    entityType: { type: String, required: true, trim: true },
    entityId: { type: String, trim: true },
    details: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
