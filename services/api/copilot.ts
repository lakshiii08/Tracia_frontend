import { MOCK_COPILOT_INITIAL_MESSAGES, generateMockCopilotResponse } from "@/mocks/copilot";
import type { CopilotMessage, CopilotQueryResponse } from "@/types/copilot";
import { apiClient } from "@/services/apiClient";

export async function getCopilotInitialMessages(): Promise<CopilotMessage[]> {
  return apiClient<CopilotMessage[]>(
    "/api/copilot/history",
    { method: "GET" },
    () => [...MOCK_COPILOT_INITIAL_MESSAGES]
  );
}

export async function queryCopilot(prompt: string, caseId?: string): Promise<CopilotQueryResponse> {
  return apiClient<CopilotQueryResponse>(
    "/api/copilot",
    {
      method: "POST",
      body: JSON.stringify({ prompt, caseId }),
    },
    () => generateMockCopilotResponse(prompt, caseId)
  );
}
