import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (message: string) => set((state) => ({
    notifications: [
      ...state.notifications,
      { id: crypto.randomUUID(), message }
    ]
  })),
  
  removeNotification: (id: string) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));