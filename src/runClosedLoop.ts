import { readFile } from "fs/promises";
import { buildEvidenceSet } from "./application/buildEvidenceSet";
import { createApplication } from "./application/createApplication";
import { applyClarificationAnswer } from "./clarification/applyClarificationAnswer";
import { generateClarificationQuestion } from "./clarification/generateClarificationQuestion";
import { applyExtraction } from "./extraction/applyExtraction";
import { extractApplicant } from "./extraction/extractApplicant";
import { evaluateMatch } from "./matching/evaluateMatch";
import { extractOpportunity } from "./opportunity/extractOpportunity";

async function main() {
  const [applicantSourcePath, opportunitySourcePath, clarificationAnswer] =
    process.argv.slice(2);

  if (!applicantSourcePath || !opportunitySourcePath) {
    throw new Error(
      "Usage: npm run closed-loop -- <applicant-source> <opportunity-source> [clarification-answer]"
    );
  }

  const [applicantSource, opportunitySource] = await Promise.all([
    readFile(applicantSourcePath, "utf8"),
    readFile(opportunitySourcePath, "utf8"),
  ]);

  const applicantId = "applicant-001";
  const opportunityId = "opportunity-001";

  const applicantExtraction = await extractApplicant(applicantId, applicantSource);
  let applicant = applyExtraction(
    applicantExtraction,
    undefined,
    applicantSourcePath
  );

  const opportunity = await extractOpportunity(opportunityId, opportunitySource);
  let match = await evaluateMatch(applicantId, applicant, opportunity);

  if (match.actionability_status !== "actionable") {
    console.log(
      JSON.stringify(
        {
          stage: "opportunity_not_actionable",
          applicant,
          opportunity,
          match,
        },
        null,
        2
      )
    );
    return;
  }

  if (match.eligibility_status === "needs_clarification") {
    const clarification = await generateClarificationQuestion(
      applicantId,
      applicant,
      opportunity,
      match
    );

    if (!clarification) {
      throw new Error("Match requires clarification but no question was generated.");
    }

    if (!clarificationAnswer) {
      console.log(
        JSON.stringify(
          {
            stage: "clarification_required",
            applicant,
            opportunity,
            match,
            clarification,
          },
          null,
          2
        )
      );
      return;
    }

    applicant = applyClarificationAnswer(
      applicant,
      clarification,
      clarificationAnswer
    );
    match = await evaluateMatch(applicantId, applicant, opportunity);
  }

  if (match.eligibility_status === "ineligible") {
    console.log(
      JSON.stringify({ stage: "ineligible", applicant, opportunity, match }, null, 2)
    );
    return;
  }

  if (match.eligibility_status === "needs_clarification") {
    const clarification = await generateClarificationQuestion(
      applicantId,
      applicant,
      opportunity,
      match
    );

    console.log(
      JSON.stringify(
        {
          stage: "clarification_required",
          applicant,
          opportunity,
          match,
          clarification,
        },
        null,
        2
      )
    );
    return;
  }

  const application = createApplication(match, opportunity);
  const evidenceSet = buildEvidenceSet(applicant, match);

  console.log(
    JSON.stringify(
      {
        stage: "application_created",
        applicant,
        opportunity,
        match,
        application,
        evidence_set: evidenceSet,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
