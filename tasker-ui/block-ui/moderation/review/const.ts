import { Root } from "./review-moderation.dto";

export const moderation_review: Root = {
  reviews: [
    {
      id: "rev-001",
      review_type: "MARKETPLACE_SERVICE",
      reviewer: {
        id: "USR-8842",
        name: "Alex Chen",
        role: "CLIENT",
      },
      target_user: {
        id: "EXP-5512",
        name: "Dr. Sarah Kim",
        role: "EXPERT",
      },
      service: {
        id: "SRV-101",
        title: "AI Strategy Consulting",
        category: "Consulting",
      },
      rating: 5,
      feedback: "Exceptional insights on our AI roadmap.",
      status: "published",
      date: "2026-06-14T14:30:00Z",
      metadata: {
        helpful_count: 12,
        reported: false,
      },
    },
    {
      id: "rev-002",
      review_type: "CONTRACT",
      reviewer: {
        id: "USR-9201",
        name: "James Wilson",
        role: "CLIENT",
      },
      target_user: {
        id: "EXP-3319",
        name: "Marcus Rivera",
        role: "EXPERT",
      },
      contract: {
        id: "CTR-2024",
        title: "Neural Network Architecture Design",
      },
      rating: 4,
      feedback: "Great technical expertise but delivery delayed.",
      status: "published",
      date: "2026-06-13T09:15:00Z",
      metadata: {
        helpful_count: 8,
        reported: false,
      },
    },
    {
      id: "rev-003",
      review_type: "CONTRACT",
      reviewer: {
        id: "EXP-7714",
        name: "Dr. Wei Zhang",
        role: "EXPERT",
      },
      target_user: {
        id: "USR-6723",
        name: "Emily Parker",
        role: "CLIENT",
      },
      contract: {
        id: "CTR-2025",
        title: "Large Language Model Fine-tuning",
      },
      rating: 3,
      feedback: "Client failed to provide required data on time.",
      status: "flagged",
      date: "2026-06-14T16:45:00Z",
      metadata: {
        helpful_count: 4,
        reported: true,
        flagged_by_admin_id: "ADM-0042",
        flagged_at: "2026-06-14T17:00:00Z",
        reputation_score_change: -15,
      },
    },
  ],
  pagination: {
    current_page: 1,
    per_page: 3,
    total_items: 1284,
    total_pages: 129,
  },
};
