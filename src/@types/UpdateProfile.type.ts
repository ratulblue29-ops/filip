export interface UpdateProfilePayload {
    city: string;
    aboutMe: string;
    skills: string[];
    openToWork: boolean;
    hourlyRate: string;
    photo?: string | null;
    bannerImage?: string | null;
    experienceYears?: number;
}
