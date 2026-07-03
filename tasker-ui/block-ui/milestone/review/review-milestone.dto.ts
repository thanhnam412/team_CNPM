export interface Root {
  status: string;
  data: Data;
}

export interface Data {
  milestone: Milestone;
  deliverables: Deliverable[];
  acceptance_criteria: AcceptanceCriterum[];
  actions: Actions;
  contract: Contract;
  metadata: Metadata;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: string;
  submitted_at: string;
  contract_percentage: number;
  value: Value;
}

export interface Value {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Deliverable {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  action_type: string;
  action_label: string;
  action_url: string;
  file?: File;
  repository?: Repository;
  demo_details?: DemoDetails;
}

export interface File {
  name: string;
  size: string;
  format: string;
}

export interface Repository {
  branch: string;
  access_granted: boolean;
}

export interface DemoDetails {
  environment: string;
  requires_authentication: boolean;
  valid_until: string;
}

export interface AcceptanceCriterum {
  id: string;
  description: string;
  required: boolean;
  checked: boolean;
  threshold?: Threshold;
}

export interface Threshold {
  metric: string;
  minimum?: number;
  unit: string;
  maximum?: number;
}

export interface Actions {
  approve: Approve;
  request_revision: RequestRevision;
  reject: Reject;
}

export interface Approve {
  type: string;
  label: string;
  icon: string;
  confirmation_message: string;
  endpoint: string;
  method: string;
}

export interface RequestRevision {
  type: string;
  label: string;
  icon: string;
  placeholder: string;
  endpoint: string;
  method: string;
  fields: Fields;
}

export interface Fields {
  feedback: Feedback;
}

export interface Feedback {
  required: boolean;
  max_length: number;
  type: string;
}

export interface Reject {
  type: string;
  label: string;
  icon: string;
  endpoint: string;
  method: string;
}

export interface Contract {
  id: string;
  total_value: TotalValue;
  milestone_number: number;
  total_milestones: number;
  escrow_release_percentage: number;
}

export interface TotalValue {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Metadata {
  reviewer_id: string;
  provider_id: string;
  last_modified: string;
  review_deadline: string;
}
