/**
 * RevenueCat purchase service
 * Replaces all Stripe callable functions on the client side.
 * Webhook (Firebase Function) handles Firestore update — Option A.
 */
import Purchases, { PurchasesPackage } from 'react-native-purchases';

// Product IDs — must match exactly what you create in RC dashboard
export const RC_PRODUCT_IDS = {
    // Credit packs (consumable)
    credit_1_pack: 'credit_1_pack',
    credit_5: 'credit_5',
    credit_12: 'credit_12',
    credit_30: 'credit_30',
    // Memberships (subscription)
    basic: 'membership_basic_v2',
    premium: 'membership_premium',
} as const;

// Fetch all available offerings from RevenueCat
export const fetchOfferings = async () => {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
};

// Purchase a single package by RC product identifier
// Throws on failure — caller handles toast/alert
export const purchasePackage = async (
    pkg: PurchasesPackage,
): Promise<void> => {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    // customerInfo reflects entitlements — RC webhook updates Firestore async
    // App reads balance from Firestore via TanStack Query invalidation
    console.log('[RC] purchase success, entitlements:', customerInfo.entitlements.active);
};

// Restore purchases — call from settings screen (required by Apple)
export const restorePurchases = async (): Promise<void> => {
    await Purchases.restorePurchases();
};