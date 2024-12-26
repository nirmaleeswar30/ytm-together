import React, { useEffect } from 'react';
import { useNotificationStore } from '../../stores/notificationStore';
import { Bell } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  useEffect(() => {
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        removeNotification(notifications[0].id);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in"
        >
          <Bell className="h-5 w-5 text-indigo-500" />
          <p className="text-gray-900">{notification.message}</p>
        </div>
      ))}
    </div>
  );
}