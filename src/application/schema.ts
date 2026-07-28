export type ApplicationStatus =
  | "selected"
  | "drafting"
  | "ready"
  | "submitted"
  | "withdrawn";

export interface ApplicationEssay {
  prompt: string;
  draft: string;
  supporting_claims: string[];
}

export interface Application {
  application_id: string;
  applicant_id: string;
  opportunity_id: string;
  match_id: string;
  status: ApplicationStatus;
  requirements: string[];
  documents: string[];
  essays: ApplicationEssay[];
  missing_items: string[];
  submitted_at: string | null;
  notes: string[];
}
