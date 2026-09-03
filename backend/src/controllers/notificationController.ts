import { Response, NextFunction } from 'express';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: 'Notification not found.' });
      return;
    }

    res.json({ notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};
