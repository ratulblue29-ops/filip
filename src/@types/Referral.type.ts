// src/@types/Referral.type.ts

export type ReferralStatus = 'pending' | 'verified';

export type ReferralItem = {
  id: string;
  referredId: string;
  referredName: string;
  referredPhoto: string | null;
  status: ReferralStatus;
  createdAt: any;
};

export type ReferralData = {
  referralCode: string;
  totalInvited: number;
  totalVerified: number;
  referrals: ReferralItem[];
};