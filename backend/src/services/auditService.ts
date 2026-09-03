import { AuditLog } from '../models/AuditLog.js';

export const logAuditAction = async (
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string,
  ipAddress?: string
): Promise<void> => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('[AuditLog Error] Failed to write audit record:', error);
  }
};
