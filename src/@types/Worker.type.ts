export interface WorkerDateRange {
  start: string; // ISO string
  end: string;
}

export default interface Worker {
  id: string;
  user: {
    id: string;
    name: string;
    photo: string;
    city?: string;
    verified?: boolean;
    openToWork?: boolean;
  };

  bannerImage?: string;
  title?: string;

  dateRange?: WorkerDateRange;

  tags: string[];
  locationText?: string;

  isAvailable?: boolean;
  isLocked?: boolean;
  status?: 'Available' | 'Starts Soon';
}
