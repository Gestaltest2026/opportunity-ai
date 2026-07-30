import {
  evaluateSourceExpansionPlan,
  generateSourceExpansionMarkdownReport,
  type SourceExpansionPlan,
} from "./sourceExpansionLanes";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fixture: SourceExpansionPlan = {
  applicant_id: "applicant-001",
  generated_for: "User #1 source-universe expansion fixture",
  purpose:
    "Verify that the system can recognize when the Opportunity Source Universe is too small to support strict application-ready recommendations.",
  rules: [
    "Search volume is not enough; each source lane must produce official or semi-official sources before applicant-facing recommendations.",
    "Aggregator leads can expand the pie but cannot prove eligibility.",
    "Strict eligibility gating remains downstream from source-universe expansion.",
  ],
  current_known_curated_source_count: 50,
  phase_1_curated_source_goal: 150,
  total_source_universe_goal: 300,
  lanes: [
    {
      lane_id: "legal-paralegal-professional-bodies",
      name: "Legal / paralegal professional bodies",
      priority: "critical",
      purpose: "Find professional-development and certification-support sources aligned with User #1's legal office path.",
      target_source_count: 40,
      minimum_official_or_semi_official_sources: 30,
      minimum_application_sources: 15,
      required_source_types: ["state paralegal associations", "local paralegal associations", "certification bodies"],
      applicant_fit_signals: ["paralegal", "legal assistant", "office manager", "professional development"],
      acquisition_queries: ["Florida paralegal association scholarship professional development", "paralegal certification scholarship"],
      current_seed_source_ids: ["paralegal-association-florida-scholarships", "nfpa-awards-scholarships"],
      current_official_or_semi_official_seed_count: 2,
      current_application_seed_count: 1,
      next_harvest_action: "Build a Florida and national paralegal-association source queue before claiming application readiness.",
      status: "underseeded",
      guardrails: ["Do not infer membership eligibility.", "Do not treat certification information as funding."],
      notes: ["This lane should be much larger than the current hand-picked list."],
    },
    {
      lane_id: "law-firm-scholarship-programs",
      name: "Law-firm scholarship programs",
      priority: "high",
      purpose: "Find law-firm scholarships for paralegal, legal studies, adult learner, and nontraditional student applicants.",
      target_source_count: 60,
      minimum_official_or_semi_official_sources: 45,
      minimum_application_sources: 25,
      required_source_types: ["law firm scholarship pages", "legal studies scholarships", "paralegal scholarships"],
      applicant_fit_signals: ["legal studies", "paralegal education", "academic merit", "essay"],
      acquisition_queries: ["2026 paralegal scholarship law firm", "legal studies scholarship adult student law firm"],
      current_seed_source_ids: ["buckfire-paralegal-scholarship"],
      current_official_or_semi_official_seed_count: 1,
      current_application_seed_count: 1,
      next_harvest_action: "Harvest law-firm scholarships as a separate source class and send program-eligibility inquiries when requirements are ambiguous.",
      status: "underseeded",
      guardrails: ["Verify each deadline at sponsor page.", "Do not assume Legal Studies equals paralegal education program."],
      notes: ["This lane is high-yield for User #1 but currently has almost no breadth."],
    },
    {
      lane_id: "women-adult-returning-learners",
      name: "Women / adult returning learners",
      priority: "critical",
      purpose: "Find nontraditional, first-degree, caregiver, women, and returning-student sources that are not tied to FGCU or UF.",
      target_source_count: 50,
      minimum_official_or_semi_official_sources: 35,
      minimum_application_sources: 15,
      required_source_types: ["adult learner grants", "women education funds", "single parent scholarships"],
      applicant_fit_signals: ["adult learner", "first bachelor", "single parent history", "returning student"],
      acquisition_queries: ["adult learner scholarship first bachelor's degree women", "returning student scholarship mother caregiver"],
      current_seed_source_ids: ["patsy-mink-education-support-award", "jeannette-rankin-scholar-grants", "peo-program-for-continuing-education"],
      current_official_or_semi_official_seed_count: 3,
      current_application_seed_count: 2,
      next_harvest_action: "Expand beyond the obvious national awards and separate financial-need blockers from narrative fit.",
      status: "underseeded",
      guardrails: ["Do not infer financial need without official aid evidence.", "Do not expose private family or financial documents in public repo."],
      notes: ["High narrative fit but often blocked by need evidence."],
    },
  ],
};

const report = evaluateSourceExpansionPlan(fixture, new Date("2026-07-31T00:00:00.000Z"));

assert(
  report.status === "SOURCE_UNIVERSE_UNDERSEEDED",
  `Expected underseeded source universe, got ${report.status}`
);
assert(report.source_universe_gap_count === 100, "Expected phase 1 source gap of 100.");
assert(report.underseeded_lane_count === 3, "All fixture lanes should be underseeded.");
assert(
  report.highest_priority_next_lane_ids.includes("legal-paralegal-professional-bodies"),
  "Legal/paralegal professional bodies should be one of the first expansion lanes."
);
assert(
  generateSourceExpansionMarkdownReport(report).includes("Opportunity Source Universe Expansion Lanes"),
  "Markdown report should include the expansion-lane title."
);

console.log(
  JSON.stringify(
    {
      source_expansion_lane_evaluation: "passed",
      status: report.status,
      source_universe_gap_count: report.source_universe_gap_count,
      underseeded_lane_count: report.underseeded_lane_count,
      highest_priority_next_lane_ids: report.highest_priority_next_lane_ids,
    },
    null,
    2
  )
);
