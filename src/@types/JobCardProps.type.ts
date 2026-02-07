export interface JobCardProps {
  job: {
    id: string;
    userId: string;
    title: string;
    location: string;
    type: string;
    rate?: {
      amount: number;
      unit: string;
    };
    user?: {
      name?: string;
      photo?: string;
    };
  };
  onBookmark: () => void;
}
