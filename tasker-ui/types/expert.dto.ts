export interface ExpertProfileDto {
  id: string;
  userId: string;
  title: string | null;
  bio: string | null;
  skills: string | string[] | Record<string, string[]> | null;
  hourlyRate: string | number;
  experienceYears: number;
  portfolioUrl: string | null;
  rating: string | number;
  updatedAt: string;
}

export interface ExpertOverviewDto {
  id: string;
  name: string;
  avatar: string | null;
  online: boolean;
  location: string | null;
  title: string | null;
  bio: string | null;
  skills: string | string[] | Record<string, string[]> | null;
  rate: string | number;
  showcase: string | null;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedTasks: number;
  reviews: unknown[];
  workHistory: unknown[];
}

export interface ExpertSearchFilterDto {
  search?: string;
  skill?: string;
  minRating?: number;
  badge?: string;
  online?: boolean;
}
