import { Response, NextFunction } from 'express';
import { DeceasedProfile } from '../models/DeceasedProfile.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { deceasedProfileSchema } from '../validators/index.js';
import { logAuditAction } from '../services/auditService.js';

export const createDeceasedProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const parseResult = deceasedProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const profileData = parseResult.data;

    // Check if user already has an active profile, or create new one
    const profile = await DeceasedProfile.create({
      userId,
      ...profileData,
      dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined,
      dateOfDeath: profileData.dateOfDeath ? new Date(profileData.dateOfDeath) : undefined,
    });

    await logAuditAction(userId, 'DECEASED_PROFILE_CREATE', 'DeceasedProfile', profile._id.toString(), profile.fullName);

    res.status(201).json({ profile });
  } catch (error) {
    next(error);
  }
};

export const getDeceasedProfiles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const profiles = await DeceasedProfile.find({ userId }).sort({ createdAt: -1 });
    res.json({ profiles });
  } catch (error) {
    next(error);
  }
};

export const getDeceasedProfileById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const profile = await DeceasedProfile.findOne({ _id: id, userId });
    if (!profile) {
      res.status(404).json({ message: 'Deceased profile not found or access denied.' });
      return;
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const updateDeceasedProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const profile = await DeceasedProfile.findOne({ _id: id, userId });
    if (!profile) {
      res.status(404).json({ message: 'Deceased profile not found or access denied.' });
      return;
    }

    const parseResult = deceasedProfileSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const updateData = parseResult.data;
    if (updateData.dateOfBirth) (updateData as any).dateOfBirth = new Date(updateData.dateOfBirth);
    if (updateData.dateOfDeath) (updateData as any).dateOfDeath = new Date(updateData.dateOfDeath);

    Object.assign(profile, updateData);
    await profile.save();

    await logAuditAction(userId!, 'DECEASED_PROFILE_UPDATE', 'DeceasedProfile', profile._id.toString(), profile.fullName);

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};
