import type {
  CuratedOpportunitySource,
  CuratedOpportunityWatchlist,
} from "./schema";

export interface MergeCuratedWatchlistsResult {
  watchlist: CuratedOpportunityWatchlist;
  base_source_count: number;
  input_source_count: number;
  merged_source_count: number;
  added_source_ids: string[];
  preserved_source_ids: string[];
  duplicate_source_ids: string[];
}

function sourceIds(sources: CuratedOpportunitySource[]): string[] {
  return sources.map((source) => source.source_id);
}

export function findDuplicateSourceIds(sources: CuratedOpportunitySource[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const source of sources) {
    if (seen.has(source.source_id)) duplicates.add(source.source_id);
    else seen.add(source.source_id);
  }

  return Array.from(duplicates).sort();
}

export function mergeCuratedWatchlists(
  base: CuratedOpportunityWatchlist,
  additions: CuratedOpportunityWatchlist[]
): MergeCuratedWatchlistsResult {
  const mergedSources: CuratedOpportunitySource[] = [...base.sources];
  const existingIds = new Set(sourceIds(base.sources));
  const addedSourceIds: string[] = [];
  const preservedSourceIds: string[] = [];
  const duplicateSourceIds = new Set(findDuplicateSourceIds(base.sources));

  for (const addition of additions) {
    if (addition.applicant_id !== base.applicant_id) {
      throw new Error(
        `Cannot merge watchlist for ${addition.applicant_id} into ${base.applicant_id}`
      );
    }

    for (const duplicate of findDuplicateSourceIds(addition.sources)) {
      duplicateSourceIds.add(duplicate);
    }

    for (const source of addition.sources) {
      if (existingIds.has(source.source_id)) {
        preservedSourceIds.push(source.source_id);
        duplicateSourceIds.add(source.source_id);
        continue;
      }

      mergedSources.push(source);
      existingIds.add(source.source_id);
      addedSourceIds.push(source.source_id);
    }
  }

  return {
    watchlist: {
      ...base,
      sources: mergedSources,
    },
    base_source_count: base.sources.length,
    input_source_count:
      base.sources.length + additions.reduce((sum, addition) => sum + addition.sources.length, 0),
    merged_source_count: mergedSources.length,
    added_source_ids: addedSourceIds,
    preserved_source_ids: Array.from(new Set(preservedSourceIds)).sort(),
    duplicate_source_ids: Array.from(duplicateSourceIds).sort(),
  };
}
