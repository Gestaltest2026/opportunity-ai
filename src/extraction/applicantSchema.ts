export interface Applicant {
  education: string[];
  career_work_history: string[];
  achievements: string[];
  financial_context: string[];
  identity_eligibility_attributes: string[];
  community_involvement: string[];
  leadership: string[];
  research_academic_interests: string[];
  career_direction: string[];
  lived_experiences: string[];
  constraints: string[];
  existing_evidence: string[];
  narrative_themes: string[];
}

export const createEmptyApplicant = (): Applicant => ({
  education: [],
  career_work_history: [],
  achievements: [],
  financial_context: [],
  identity_eligibility_attributes: [],
  community_involvement: [],
  leadership: [],
  research_academic_interests: [],
  career_direction: [],
  lived_experiences: [],
  constraints: [],
  existing_evidence: [],
  narrative_themes: [],
});
