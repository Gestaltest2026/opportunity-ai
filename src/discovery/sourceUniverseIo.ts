import { readFile, writeFile } from "node:fs/promises";
import {
  SourceUniverse,
  SourceUniverseSchema,
} from "./sourceUniverseSchema";

export async function readSourceUniverse(
  path: string,
  fallback: SourceUniverse = { sources: [] }
): Promise<SourceUniverse> {
  let raw: unknown;

  try {
    raw = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }

  const parsed = SourceUniverseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Source universe failed schema validation: ${path}`);
  }

  return parsed.data;
}

export async function writeSourceUniverse(
  path: string,
  universe: SourceUniverse
): Promise<void> {
  const parsed = SourceUniverseSchema.parse(universe);
  await writeFile(path, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}
