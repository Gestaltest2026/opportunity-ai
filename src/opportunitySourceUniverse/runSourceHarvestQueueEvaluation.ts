import {
  evaluateSourceHarvestQueue,
  generateSourceHarvestQueueMarkdownReport,
  type SourceHarvestQueue,
} from "./sourceHarvestQueue";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fixture: SourceHarvestQueue = {
  applicant_id: "applicant-001",
  generated_for: "User #1 legal/paralegal harvest queue fixture",
  purpose:
    "Verify that source harvesting expands the User #1 opportunity pie without pretending harvested leads are application-ready.",
  rules: [
    "Harvesting creates candidate source leads, not applicant eligibility.",
    "Official or sponsor pages are preferred; aggregators are discovery leads only.",
    "No candidate source becomes application-ready until strict eligibility gating runs downstream.",
  ],
  source_universe_current_count: 50,
  source_universe_phase_1_goal: 150,
  harvest_queue_target_candidate_count: 50,
  lanes: [
    {
      lane_id: "legal-paralegal-professional-bodies",
      name: "Legal / paralegal professional bodies",
      priority: "critical",
      purpose:
        "Find official paralegal, legal assistant, bar-adjacent, and certification-body sources that may support professional development or scholarships.",
      target_candidate_count: 30,
      minimum_official_or_sponsor_candidates: 20,
      query_tasks: [
        {
          task_id: "query-legal-body-001",
          query: "state paralegal association scholarship professional development",
          target_candidate_count: 4,
          expected_source_types: ["professional_body", "official_sponsor"],
          required_verification_steps: [
            "Open sponsor page.",
            "Confirm current cycle, deadline, membership rule, and eligible expense type.",
          ],
          harvested_candidate_ids: [],
          notes: ["Seed query only; no eligibility claim."],
        },
      ],
      guardrails: [
        "Membership requirements are hard blockers until observed.",
        "Expired scholarship pages may become pattern archives, not current recommendations.",
      ],
      notes: ["This lane should be harvested before broader women/adult learner databases."],
    },
    {
      lane_id: "law-firm-scholarship-programs",
      name: "Law-firm scholarship programs",
      priority: "critical",
      purpose:
        "Find law-firm-sponsored scholarship pages that accept legal studies, paralegal, or nontraditional undergraduate applicants.",
      target_candidate_count: 20,
      minimum_official_or_sponsor_candidates: 15,
      query_tasks: [
        {
          task_id: "query-law-firm-001",
          query: "law firm paralegal scholarship 2026 legal studies student",
          target_candidate_count: 5,
          expected_source_types: ["law_firm", "official_sponsor"],
          required_verification_steps: [
            "Open law firm sponsor page.",
            "Confirm citizenship, enrollment, transcript, essay, and deadline requirements.",
          ],
          harvested_candidate_ids: [],
          notes: ["Seed query only; no eligibility claim."],
        },
      ],
      guardrails: [
        "Law-firm marketing pages must still be treated as sponsor pages only after URL verification.",
        "Do not infer that Legal Studies equals paralegal program unless source permits it.",
      ],
      notes: ["This lane targets school-independent opportunities first."],
    },
  ],
  candidates: [],
};

const report = evaluateSourceHarvestQueue(fixture, new Date("2026-07-31T00:00:00.000Z"));
assert(report.status === "READY_FOR_MANUAL_HARVEST", `Expected manual harvest status, got ${report.status}`);
assert(report.lane_count === 2, "Fixture should contain the two highest-priority lanes.");
assert(report.harvest_queue_target_candidate_count === 50, "Fixture should target 50 candidate sources.");
assert(report.harvested_candidate_count === 0, "Fixture should not pretend sources have already been harvested.");
assert(report.candidate_gap_count === 50, "Empty queue should expose a 50-candidate gap.");
assert(
  report.highest_priority_next_lane_ids.includes("legal-paralegal-professional-bodies"),
  "Legal/paralegal bodies lane should be a highest-priority harvest target."
);
assert(
  generateSourceHarvestQueueMarkdownReport(report).includes("No candidate source becomes application-ready"),
  "Markdown should expose the no-application-ready-at-harvest guardrail."
);

console.log(
  JSON.stringify(
    {
      source_harvest_queue_evaluation: "passed",
      status: report.status,
      lane_count: report.lane_count,
      target_candidate_count: report.harvest_queue_target_candidate_count,
      candidate_gap_count: report.candidate_gap_count,
      highest_priority_next_lane_ids: report.highest_priority_next_lane_ids,
    },
    null,
    2
  )
);
