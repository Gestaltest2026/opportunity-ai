export type ClaimCategory =
  | "Education"
  | "Professional"
  | "Identity / Background"
  | "Life Context"
  | "Leadership"
  | "Community Service"
  | "Skills"
  | "Geography"
  | "Financial Context"
  | "Goals"
  | "Trajectory";

export type ClaimConfidence = "high" | "medium" | "low";

export type VerificationStatus =
  | "explicit"
  | "derived"
  | "inferred"
  | "unknown";

export interface ApplicantClaim {
  claim: string;
  category: ClaimCategory;

  evidence: string;
  source: string;

  confidence: ClaimConfidence;
  verification_status: VerificationStatus;

  reasoning?: string;

  time_context?: {
    status?: "current" | "historical";
    start_year?: number;
    end_year?: number | null;
    duration_years?: number;
  };
}

export interface ApplicantExtraction {
  applicant_id: string;

  claims: ApplicantClaim[];

  unknowns: string[];

  warnings: string[];
}
