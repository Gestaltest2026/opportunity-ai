import { readFile, writeFile } from "node:fs/promises";
import {
  readOpportunityDatabank,
  writeOpportunityDatabank,
} from "../databank/io";
import { refreshSources } from "./refreshSources";
import { isSourceRegistry, SourceRegistry } from "./schema";

async function readSourceRegistry(path: string): Promise<SourceRegistry> {
  let raw: unknown;

  try {
    raw = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { sources: [] };
    throw error;
  }

  if (!isSourceRegistry(raw)) {
    throw new Error(`Source registry failed schema validation: ${path}`);
  }

  return raw;
}

async function main() {
  const [registryPath, databankPath] = process.argv.slice(2);

  if (!registryPath || !databankPath) {
    throw new Error(
      "Usage: npm run sources:refresh -- <sources.json> <databank.json>"
    );
  }

  const [registry, databank] = await Promise.all([
    readSourceRegistry(registryPath),
    readOpportunityDatabank(databankPath),
  ]);

  const result = await refreshSources(registry, databank);

  await Promise.all([
    writeFile(registryPath, `${JSON.stringify(result.registry, null, 2)}\n`, "utf8"),
    writeOpportunityDatabank(databankPath, result.databank),
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
