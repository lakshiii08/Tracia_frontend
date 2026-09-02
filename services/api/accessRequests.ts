import { INITIAL_MOCK_ACCESS_REQUESTS } from "@/mocks/accessRequests";
import type { AccessLevel, AccessRequest, Role } from "@/types/accessControl";

let accessRequestsStore: AccessRequest[] = [...INITIAL_MOCK_ACCESS_REQUESTS];

export async function getAccessRequests(): Promise<AccessRequest[]> {
  return Promise.resolve(accessRequestsStore);
}

export function getAccessRequestsSync(): AccessRequest[] {
  return accessRequestsStore;
}

export async function createAccessRequest(data: {
  userId: string;
  userName: string;
  userRole: Role;
  caseId: string;
  caseTitle: string;
  currentLevel: AccessLevel;
  requestedLevel: AccessLevel;
  reason: string;
}): Promise<AccessRequest> {
  const count = accessRequestsStore.length + 1;
  const newReq: AccessRequest = {
    id: `req-${100 + count}`,
    requestId: `AR-2025-00${count}`,
    userId: data.userId,
    userName: data.userName,
    userRole: data.userRole,
    caseId: data.caseId,
    caseTitle: data.caseTitle,
    currentLevel: data.currentLevel,
    requestedLevel: data.requestedLevel,
    reason: data.reason,
    status: "PENDING",
    createdAt: new Date().toLocaleString(),
  };

  accessRequestsStore = [newReq, ...accessRequestsStore];
  return Promise.resolve(newReq);
}

export async function approveAccessRequest(requestId: string, reviewerName: string = "Inspector A. Admin"): Promise<AccessRequest | null> {
  let updated: AccessRequest | null = null;
  accessRequestsStore = accessRequestsStore.map((req) => {
    if (req.id === requestId || req.requestId === requestId) {
      updated = {
        ...req,
        status: "APPROVED",
        updatedAt: new Date().toLocaleString(),
        reviewedBy: reviewerName,
      };
      return updated;
    }
    return req;
  });
  return Promise.resolve(updated);
}

export async function rejectAccessRequest(requestId: string, reviewerName: string = "Inspector A. Admin"): Promise<AccessRequest | null> {
  let updated: AccessRequest | null = null;
  accessRequestsStore = accessRequestsStore.map((req) => {
    if (req.id === requestId || req.requestId === requestId) {
      updated = {
        ...req,
        status: "REJECTED",
        updatedAt: new Date().toLocaleString(),
        reviewedBy: reviewerName,
      };
      return updated;
    }
    return req;
  });
  return Promise.resolve(updated);
}
