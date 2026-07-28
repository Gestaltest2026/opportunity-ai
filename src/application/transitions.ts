import { Application, ApplicationEssay } from "./schema";

function removeMissingItem(application: Application, item: string): string[] {
  return application.missing_items.filter((missing) => missing !== item);
}

export function addApplicationDocument(
  application: Application,
  requirement: string,
  document: string
): Application {
  return {
    ...application,
    status: "drafting",
    documents: [...application.documents, document],
    missing_items: removeMissingItem(application, requirement),
  };
}

export function addApplicationEssay(
  application: Application,
  requirement: string,
  essay: ApplicationEssay
): Application {
  return {
    ...application,
    status: "drafting",
    essays: [...application.essays, essay],
    missing_items: removeMissingItem(application, requirement),
  };
}

export function markApplicationReady(application: Application): Application {
  if (application.missing_items.length > 0) {
    throw new Error("Cannot mark application ready while required items are missing.");
  }

  return {
    ...application,
    status: "ready",
  };
}

export function markApplicationSubmitted(
  application: Application,
  submittedAt: string
): Application {
  if (application.status !== "ready") {
    throw new Error("Only a ready application can be submitted.");
  }

  return {
    ...application,
    status: "submitted",
    submitted_at: submittedAt,
  };
}
