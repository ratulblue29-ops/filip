type UserInfo = {
  id: string;
  name?: string;
};

export type seasonalJobs = {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt?: any;
  updatedAt?: any;
  userId: string;
  location?: string[];
  rate?: {
    amount: number;
    unit: string;
  };
  positions?: {
    total: number;
    filled: number;
  };
  visibility?: {
    priority: string;
  };
  user?: UserInfo | null;
  [key: string]: any;
};
