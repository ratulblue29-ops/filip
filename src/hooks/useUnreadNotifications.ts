import { useQuery } from '@tanstack/react-query';
import { fetchMyNotifications } from '../services/notification';
import { getAuth } from '@react-native-firebase/auth';

export const useUnreadNotifications = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
    enabled: !!getAuth().currentUser,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    isLoading,
  };
};
