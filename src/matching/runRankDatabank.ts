import { readFile } from "fs/promises";
import { applyExtraction } from "../extraction/applyExtraction";
import { extractApplicant } from "../extraction/extractApplicant";
import { OpportunityDatabank } from "../databank/schema";
import { rankDatabank } from "./rankDatabank";

async function main() {
  const [applicantSourcePath, databankPath] = process.argv.slice(2);

  if (!applicantSourcePath || !databankPath) {
    throw new Error(
      "Usage: npm run databank:rank -- <applicant-source> <databank.json>"
    );
  }

  const [applicantSource, databankText] = await Promise.all([
    readFile(applicantSourcePath, "utf8"),
    readFile(databankPath, "utf8"),
  ]);

  const applicantId = "applicant-001";
  const extraction = await extractApplicant(applicantId, applicantSource);
  const applicant = applyExtraction(
    extraction,
    undefined,
    applicantSourcePath
  );
  const databank = JSON.parse(databankText) as OpportunityDatabank;
  const ranked = await rankDatabank(applicantId, applicant, databank);

  console.log(JSON.stringify(ranked, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
