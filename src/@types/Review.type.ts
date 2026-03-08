export type ReviewProps = {
  name: string;
  role: string;
  time: string;
  text: string;
  rating: string;
  photo?: string | null;
};

export type ReviewItem = {
  id: string;
  engagementId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  text: string;
  isRevealed: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  fromUserName?: string;
  fromUserPhoto?: string | null;
  fromUserRole?: string;
};