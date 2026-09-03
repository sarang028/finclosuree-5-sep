import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../services/apiServices';
import { NotificationItem } from '../types';
import { Bell, CheckCheck, Sparkles, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      console.error('[Fetch Notifications Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('[Mark Read Error]', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      fetchNotifications();
    } catch (err) {
      console.error('[Mark All Read Error]', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications & Activity Alerts</h1>
          <p className="text-xs text-slate-400 mt-0.5">Stay updated on asset discoveries, document status, and claim progress.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 text-xs font-semibold text-teal-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center"
          >
            <CheckCheck className="w-4 h-4 mr-1.5 text-teal-400" /> Mark All as Read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="glass-card rounded-2xl border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-teal-950/20' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === 'ai_discovery' ? (
                    <Sparkles className="w-4 h-4 text-teal-400" />
                  ) : n.type === 'action_required' ? (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Info className="w-4 h-4 text-sky-400" />
                  )}
                </div>

                <div>
                  <h3 className={`text-xs font-bold ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>{n.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-normal">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="text-slate-500 hover:text-teal-400 p-1 text-xs"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-2xl border-slate-800 text-center text-slate-400 text-xs">
          <Bell className="w-8 h-8 text-teal-400 mx-auto mb-2" />
          No notifications in your feed right now.
        </div>
      )}
    </div>
  );
};
