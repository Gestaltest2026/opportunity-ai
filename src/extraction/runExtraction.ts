import fs from "fs";
import path from "path";
import { extractApplicant } from "./extractApplicant";

async function main() {
  const sourcePath = path.join(
    process.cwd(),
    "examples",
    "applicant-001",
    "source.md"
  );

  const sourceText = fs.readFileSync(sourcePath, "utf8");

  console.log("Running extraction...");

  const result = await extractApplicant(
    "applicant-001",
    sourceText
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("Extraction failed:");
  console.error(error);
  process.exit(1);
});
