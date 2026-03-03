export interface UpdateProfilePayload {
    city: string;
    aboutMe: string;
    name: string;
    skills: string[];
    openToWork: boolean;
    hourlyRate: string;
    photo?: string | null;
    bannerImage?: string | null;
    experienceYears?: number;
}

export type UpdateEmployerProfilePayload = {
  photo?: string | null;
  companyName: string;
  industry: string;
  about: string;
  address: string;
  contactName: string;
  phone: string;
};