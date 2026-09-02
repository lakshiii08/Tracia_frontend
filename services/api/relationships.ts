import { MOCK_CASE_RELATIONSHIPS } from "@/mocks/relationships";
import type { CaseRelationship } from "@/types/relationships";

let relationshipsStore: CaseRelationship[] = [...MOCK_CASE_RELATIONSHIPS];

export async function getCaseRelationships(caseId?: string): Promise<CaseRelationship[]> {
  if (!caseId) return Promise.resolve(relationshipsStore);
  const filtered = relationshipsStore.filter(
    (r) => r.sourceCaseId === caseId || r.targetCaseId === caseId
  );
  return Promise.resolve(filtered);
}

export function getCaseRelationshipsSync(caseId?: string): CaseRelationship[] {
  if (!caseId) return relationshipsStore;
  return relationshipsStore.filter(
    (r) => r.sourceCaseId === caseId || r.targetCaseId === caseId
  );
}

export async function getRelatedCases(caseId: string): Promise<CaseRelationship[]> {
  return getCaseRelationships(caseId);
}
