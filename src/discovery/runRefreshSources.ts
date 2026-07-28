import { readFile, writeFile } from "node:fs/promises";
import {
  isOpportunityDatabank,
  OpportunityDatabank,
} from "../databank/schema";
import { refreshSources } from "./refreshSources";
import { isSourceRegistry, SourceRegistry } from "./schema";

async function readJson(path: string, fallback: unknown): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }
}

async function main() {
  const [registryPath, databankPath] = process.argv.slice(2);

  if (!registryPath || !databankPath) {
    throw new Error(
      "Usage: npm run sources:refresh -- <sources.json> <databank.json>"
    );
  }

  const [registryRaw, databankRaw] = await Promise.all([
    readJson(registryPath, { sources: [] }),
    readJson(databankPath, { records: [] }),
  ]);

  if (!isSourceRegistry(registryRaw)) {
    throw new Error("Source registry failed schema validation.");
  }

  if (!isOpportunityDatabank(databankRaw)) {
    throw new Error("Opportunity databank failed schema validation.");
  }

  const registry: SourceRegistry = registryRaw;
  const databank: OpportunityDatabank = databankRaw;
  const result = await refreshSources(registry, databank);

  await Promise.all([
    writeFile(registryPath, `${JSON.stringify(result.registry, null, 2)}\n`, "utf8"),
    writeFile(databankPath, `${JSON.stringify(result.databank, null, 2)}\n`, "utf8"),
  ]);

  console.log(
    JSON.stringify(
      {
        refreshed_source_ids: result.refreshed_source_ids,
        failed_sources: result.failed_sources,
        databank_records: result.databank.records.length,
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
