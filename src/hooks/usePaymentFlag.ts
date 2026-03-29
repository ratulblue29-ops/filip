import { useQuery } from '@tanstack/react-query';
import { fetchPaymentFlag } from '../services/paymentFlag';

// Cached flag — fetched once per session, stale after 5 min
export const usePaymentFlag = () => {
    const { data: paymentEnabled = false } = useQuery({
        queryKey: ['paymentFlag'],
        queryFn: fetchPaymentFlag,
        staleTime: 5 * 60 * 1000,
    });
    return paymentEnabled;
};