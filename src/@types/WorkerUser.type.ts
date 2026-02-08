export interface WorkerUser {
  id: string;
  email?: string;
  profile?: {
    name?: string;
    photo?: string;
    city?: string;
  };
  workerProfile?: {
    aboutMe?: string;
    skills?: string[];
    hourlyRate?: number;
    openToWork?: boolean;
    baseCity?: string;
    experienceYears?: number;
    rating?: number;
    reviewsCount?: number;
    availability?: {
      type: string;
      isAvailable: boolean;
      seasonLabel: string;
      dateRange: {
        start: any;
        end: any;
      };
    };
  };
  role?: string;
  roles?: string[];
  verified?: boolean;
}
