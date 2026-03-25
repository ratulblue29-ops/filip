export interface JobCardProps {
  job: {
    id: string;
    userId: string;
    title: string;
    location: string;
    type: string;
    description?: string;
    rate?: {
      amount: number;
      unit: string;
    };
    user?: {
      name?: string;
      photo?: string;
    };
    isApplied?: boolean;
    isWishlisted?: boolean;
  };
  onBookmark: () => void;
}
