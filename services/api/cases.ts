import { MOCK_CASES_DATA, type ExtendedCaseItem } from "@/mocks/cases";

let casesStore: ExtendedCaseItem[] = [...MOCK_CASES_DATA];

export async function getCases(): Promise<ExtendedCaseItem[]> {
  return Promise.resolve(casesStore);
}

export function getCasesSync(): ExtendedCaseItem[] {
  return casesStore;
}

export async function getCaseById(caseId: string): Promise<ExtendedCaseItem | null> {
  const found = casesStore.find((c) => c.id === caseId) || null;
  return Promise.resolve(found);
}

export async function getAssignedCases(userId: string): Promise<ExtendedCaseItem[]> {
  const assigned = casesStore.filter((c) => c.assignedOfficerIds?.includes(userId));
  return Promise.resolve(assigned);
}

export async function addCaseApi(input: {
  name: string;
  desc: string;
  category: string;
  priority: "High" | "Medium" | "Critical" | "Low";
  assignedOfficerId?: string;
}): Promise<ExtendedCaseItem> {
  const newId = `C-${1000 + casesStore.length + 1}`;
  const newCase: ExtendedCaseItem = {
    id: newId,
    name: input.name,
    desc: input.desc,
    entities: 1,
    date: new Date().toISOString().split("T")[0],
    status: "Active",
    tone: "person",
    icon: "folder",
    href: `/case/${newId}`,
    priority: input.priority || "High",
    category: input.category || "General",
    classification: "Confidential",
    assignedOfficerIds: [input.assignedOfficerId || "IO-101"],
    assignees: [
      { name: "Det. J. Smith", role: "Lead Investigator" },
      { name: "Inspector A. Admin", role: "Supervising Admin" },
    ],
  };

  casesStore = [newCase, ...casesStore];
  return Promise.resolve(newCase);
}
