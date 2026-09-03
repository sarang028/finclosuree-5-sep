import { Response, NextFunction } from 'express';
import { Asset } from '../models/Asset.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { assetSchema } from '../validators/index.js';
import { logAuditAction } from '../services/auditService.js';
import { Notification } from '../models/Notification.js';

export const getAssets = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { category, status, search, deceasedId, sort } = req.query;

    const query: any = { userId };
    if (deceasedId) query.deceasedId = deceasedId;
    if (category) query.category = category;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { institution: { $regex: search as string, $options: 'i' } },
        { accountOrPolicyNumber: { $regex: search as string, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'value_desc') sortOption = { estimatedValue: -1 };
    if (sort === 'value_asc') sortOption = { estimatedValue: 1 };
    if (sort === 'name') sortOption = { name: 1 };

    const assets = await Asset.find(query).sort(sortOption);
    res.json({ assets });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found or access denied.' });
      return;
    }

    res.json({ asset });
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const parseResult = assetSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    const asset = await Asset.create({
      userId,
      ...parseResult.data,
      status: parseResult.data.status || 'Known',
    });

    await logAuditAction(userId, 'ASSET_CREATE', 'Asset', asset._id.toString(), `${asset.name} (${asset.institution})`);

    res.status(201).json({ asset });
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found or access denied.' });
      return;
    }

    const parseResult = assetSchema.partial().safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ message: parseResult.error.errors[0].message });
      return;
    }

    Object.assign(asset, parseResult.data);
    await asset.save();

    await logAuditAction(userId!, 'ASSET_UPDATE', 'Asset', asset._id.toString(), asset.name);

    res.json({ asset });
  } catch (error) {
    next(error);
  }
};

export const confirmAsset = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found or access denied.' });
      return;
    }

    asset.status = 'Confirmed';
    await asset.save();

    await logAuditAction(userId!, 'ASSET_CONFIRM', 'Asset', asset._id.toString(), asset.name);

    await Notification.create({
      userId,
      title: 'Potential Asset Confirmed',
      message: `Asset "${asset.name}" (${asset.institution}) has been confirmed into your financial portfolio.`,
      type: 'info',
      link: '/assets',
    });

    res.json({ message: 'Asset confirmed successfully.', asset });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const asset = await Asset.findOneAndDelete({ _id: id, userId });
    if (!asset) {
      res.status(404).json({ message: 'Asset not found or access denied.' });
      return;
    }

    await logAuditAction(userId!, 'ASSET_DELETE', 'Asset', id, asset.name);

    res.json({ message: 'Asset removed successfully.' });
  } catch (error) {
    next(error);
  }
};
