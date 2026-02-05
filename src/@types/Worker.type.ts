export interface WorkerDateRange {
  start: string; // ISO string
  end: string;
}

export interface WorkerRate {
  amount: number;
  unit: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export default interface Worker {
  id: string;

  user: {
    id: string;
    name: string;
    photo: string;
    city?: string;
    verified?: boolean;

    // 🔹 keep original
    openToWork?: boolean;

    // 🔹 add alias (for your current code)
    opentowork?: boolean;

    rating?: number;
    reviewsCount?: number;
  };

  // 🔹 already existed, kept
  location?: string[];

  // 🔹 added (used in UI)
  distance?: string;

  bannerImage?: string;
  title?: string;

  // 🔹 added (used in WorkerCard)
  description?: string;

  // 🔹 added
  rate?: WorkerRate;

  dateRange?: WorkerDateRange;

  tags: string[];
  locationText?: string;

  isAvailable?: boolean;
  isLocked?: boolean;
  status?: 'Available' | 'Starts Soon';
}
