import { useState, useCallback } from 'react';

const useRefresh = (refetchFn: () => Promise<any>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchFn();
    } finally {
      setRefreshing(false);
    }
  }, [refetchFn]);

  return { refreshing, onRefresh };
};

export default useRefresh;