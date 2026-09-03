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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated on asset discoveries and claim progress.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 text-xs font-bold text-finclosure-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center"
          >
            <CheckCheck className="w-4 h-4 mr-1.5 text-finclosure-800" /> Mark All Read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden shadow-2xs">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-emerald-50/40' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-finclosure-800 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === 'ai_discovery' ? (
                    <Sparkles className="w-4 h-4 text-finclosure-800" />
                  ) : n.type === 'action_required' ? (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <div>
                  <h3 className={`text-xs font-extrabold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-normal">{n.message}</p>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    className="px-3 py-1 bg-white hover:bg-slate-50 text-finclosure-800 border border-slate-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    View Details
                  </Link>
                )}
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n._id)}
                    className="text-slate-400 hover:text-finclosure-800 p-1 text-xs"
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
        <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center text-slate-500 text-xs">
          <Bell className="w-8 h-8 text-finclosure-800 mx-auto mb-2" />
          No notifications in your feed right now.
        </div>
      )}
    </div>
  );
};
