// types/Job.ts

export interface DbTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface Rate {
  amount: number;
  unit: 'hour' | 'day' | 'week' | 'month';
}

export interface Schedule {
  start: string;
  end: string;
}

export interface Membership {
  expiresAt: DbTimestamp | null;
  startedAt: DbTimestamp | null;
  fullTimeAdsLimit: number;
  fullTimeAdsPostedThisMonth: number;
  tier: 'free' | 'premium' | 'pro';
  monthKey: string;
}

export interface JobUser {
  id: string;
  name: string;
  photo: string;
  email: string;
  verified?: boolean;
  membership: Membership;
}

export interface Feedtype {
  id: string;
  title: string;
  description: string;

  type: 'seasonal' | 'fulltime';
  location: string[];

  bannerImage: string;

  rate: Rate;
  schedule?: Schedule;

  requiredSkills: string[];
  subAvailability?: string;

  userId: string;
  user: JobUser;

  createdAt: DbTimestamp;
  updatedAt: DbTimestamp;
}
