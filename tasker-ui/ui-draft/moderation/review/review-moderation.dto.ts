export interface Root {
  reviews: Review[];
  pagination: Pagination;
}

export interface Review {
  id: string;
  review_type: string;
  reviewer: Reviewer;
  target_user: TargetUser;
  service?: Service;
  contract?: Contract;
  rating: number;
  feedback: string;
  status: string;
  date: string;
  metadata: Metadata;
}

export interface Reviewer {
  id: string;
  name: string;
  role: string;
}

export interface TargetUser {
  id: string;
  name: string;
  role: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
}

export interface Contract {
  id: string;
  title: string;
}

export interface Metadata {
  helpful_count: number;
  reported: boolean;
  flagged_by_admin_id?: string;
  flagged_at?: string;
  reputation_score_change?: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}
