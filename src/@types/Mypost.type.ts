type AvailabilityStatus = 'active' | 'consumed' | 'withdrawn' | 'expired';
type AvailabilityType = 'fulltime' | 'seasonal' | 'daily' | 'other';

export type Mypost = {
  id: string;
  title: string;
  type: AvailabilityType;
  status: AvailabilityStatus;
  createdAt?: string;
  schedule?: {
    start: string;
    end: string;
  };
  icon?: string;
};
