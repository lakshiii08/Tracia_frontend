import { MOCK_CDR_RECORDS, MOCK_CDR_RELAY_CHAIN, MOCK_CDR_METRICS } from "@/mocks/cdr";
import type { CdrRecord, CdrRelayChain, CdrMetrics } from "@/types/cdr";
import { apiClient } from "@/services/apiClient";

let cdrRecordsStore: CdrRecord[] = [...MOCK_CDR_RECORDS];

export async function getCdrRecords(caseId?: string): Promise<CdrRecord[]> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<CdrRecord[]>(
    `/api/cdr${query}`,
    { method: "GET" },
    () => [...cdrRecordsStore]
  );
}

export function getCdrRecordsSync(): CdrRecord[] {
  return [...cdrRecordsStore];
}

export async function getCdrRelayChain(caseId?: string): Promise<CdrRelayChain> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<CdrRelayChain>(
    `/api/cdr/relay-chain${query}`,
    { method: "GET" },
    () => ({ ...MOCK_CDR_RELAY_CHAIN })
  );
}

export async function getCdrMetrics(caseId?: string): Promise<CdrMetrics> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<CdrMetrics>(
    `/api/cdr/metrics${query}`,
    { method: "GET" },
    () => ({ ...MOCK_CDR_METRICS })
  );
}

export async function addCdrRecord(record: Omit<CdrRecord, "id">): Promise<CdrRecord> {
  return apiClient<CdrRecord>(
    "/api/cdr",
    { method: "POST", body: JSON.stringify(record) },
    () => {
      const newRecord: CdrRecord = {
        ...record,
        id: `cdr-${100 + cdrRecordsStore.length + 1}`,
      };
      cdrRecordsStore = [newRecord, ...cdrRecordsStore];
      return newRecord;
    }
  );
}
