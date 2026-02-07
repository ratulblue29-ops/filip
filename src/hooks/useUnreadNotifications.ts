import { useQuery } from '@tanstack/react-query';
import { fetchMyNotifications } from '../services/notification';

export const useUnreadNotifications = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    isLoading,
  };
};
