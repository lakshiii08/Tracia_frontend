import type { AuditEntry } from "@/lib/store";

let auditLogsStore: AuditEntry[] = [
  { id: "aud-1", time: "2025-05-23 10:14:02", message: "Case access request submitted for C-1045 by Det. J. Smith", actor: "IO-101" },
  { id: "aud-2", time: "2025-05-23 09:45:10", message: "Case access request APPROVED for C-1001 by Admin", actor: "Inspector A. Admin" },
  { id: "aud-3", time: "2025-05-23 08:30:15", message: "User session authenticated: Det. J. Smith (Investigating Officer)", actor: "SYSTEM" },
];

export async function getAuditLogs(): Promise<AuditEntry[]> {
  return Promise.resolve(auditLogsStore);
}

export function logAuditEventSync(message: string, actor: string = "SYSTEM"): AuditEntry {
  const newEntry: AuditEntry = {
    id: `aud-${Date.now()}`,
    time: new Date().toISOString().replace("T", " ").substring(0, 19),
    message,
    actor,
  };
  auditLogsStore = [newEntry, ...auditLogsStore];
  return newEntry;
}

export async function logAuditEvent(message: string, actor: string = "SYSTEM"): Promise<AuditEntry> {
  return Promise.resolve(logAuditEventSync(message, actor));
}
