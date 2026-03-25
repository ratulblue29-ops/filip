export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'hired';

export interface OfferItem {
  id: string;
  status: OfferStatus;
  createdAt: any;
  job: {
    id: string;
    title: string;
    description?: string;
    rate?: { amount: number; unit: string };
    location?: string[];
    schedule?: any;
    type?: string;
  };
}
