import { Root } from "./review-milestone.dto";

export const review: Root = {
  status: "success",
  data: {
    milestone: {
      id: "milestone-001",
      title: "Review Milestone",
      description: "Core AI Chatbot Development",
      status: "UNDER_REVIEW",
      submitted_at: "2024-10-24T00:00:00Z",
      contract_percentage: 75,
      value: {
        amount: 5000.0,
        currency: "USD",
        formatted: "$5,000.00",
      },
    },
    deliverables: [
      {
        id: "del-001",
        type: "api",
        title: "API (RESTful endpoints)",
        description:
          "Complete set of endpoints for chat completion, context management, and user history.",
        icon: "api",
        action_type: "download",
        action_label: "Download",
        action_url: "https://api.example.com/download/endpoints",
        file: {
          name: "api-endpoints-v1.0.zip",
          size: "2.4 MB",
          format: "zip",
        },
      },
      {
        id: "del-002",
        type: "source_code",
        title: "Source code (GitHub repository)",
        description:
          "Access granted to the main repository branch 'release/v1.0'.",
        icon: "code",
        action_type: "external_link",
        action_label: "Open in New",
        action_url: "https://github.com/example/repo/tree/release/v1.0",
        repository: {
          branch: "release/v1.0",
          access_granted: true,
        },
      },
      {
        id: "del-003",
        type: "documentation",
        title: "Documentation (PDF)",
        description:
          "Technical architecture, integration guide, and API reference manual.",
        icon: "picture_as_pdf",
        action_type: "download",
        action_label: "Download",
        action_url: "https://api.example.com/download/documentation",
        file: {
          name: "technical-documentation-v1.0.pdf",
          size: "5.1 MB",
          format: "pdf",
        },
      },
      {
        id: "del-004",
        type: "demo",
        title: "Demo Link",
        description: "Live demo environment for testing and validation.",
        icon: "preview",
        action_type: "external_link",
        action_label: "Open in New",
        action_url: "https://staging-env.example.com",
        demo_details: {
          environment: "staging",
          requires_authentication: true,
          valid_until: "2024-11-24T23:59:59Z",
        },
      },
    ],
    acceptance_criteria: [
      {
        id: "ac-001",
        description: "NLU Engine integrated with 95% accuracy",
        required: true,
        checked: false,
        threshold: {
          metric: "accuracy",
          minimum: 95,
          unit: "percent",
        },
      },
      {
        id: "ac-002",
        description: "API latency < 200ms",
        required: true,
        checked: false,
        threshold: {
          metric: "latency",
          maximum: 200,
          unit: "milliseconds",
        },
      },
      {
        id: "ac-003",
        description: "Comprehensive unit testing > 80%",
        required: true,
        checked: false,
        threshold: {
          metric: "test_coverage",
          minimum: 80,
          unit: "percent",
        },
      },
      {
        id: "ac-004",
        description: "Deployment documentation updated",
        required: true,
        checked: false,
      },
    ],
    actions: {
      approve: {
        type: "approve",
        label: "Approve & Release Funds",
        icon: "check_circle",
        confirmation_message:
          "Releasing $5,000.00 from escrow to the provider.",
        endpoint: "/api/v1/milestones/milestone-001/approve",
        method: "POST",
      },
      request_revision: {
        type: "revision",
        label: "Request Revision",
        icon: "edit_note",
        placeholder: "Provide specific feedback on what needs to be changed...",
        endpoint: "/api/v1/milestones/milestone-001/revision",
        method: "POST",
        fields: {
          feedback: {
            required: true,
            max_length: 1000,
            type: "textarea",
          },
        },
      },
      reject: {
        type: "reject",
        label: "Reject & Raise Dispute",
        icon: "warning",
        endpoint: "/api/v1/milestones/milestone-001/dispute",
        method: "POST",
      },
    },
    contract: {
      id: "contract-001",
      total_value: {
        amount: 6666.67,
        currency: "USD",
        formatted: "$6,666.67",
      },
      milestone_number: 3,
      total_milestones: 4,
      escrow_release_percentage: 100,
    },
    metadata: {
      reviewer_id: "user-123",
      provider_id: "provider-456",
      last_modified: "2024-10-25T10:30:00Z",
      review_deadline: "2024-11-07T23:59:59Z",
    },
  },
};
