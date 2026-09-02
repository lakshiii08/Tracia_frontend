import { MOCK_TIMELINE_EVENTS } from "@/mocks/timeline";
import type { TimelineEvent } from "@/types/timeline";
import { apiClient } from "@/services/apiClient";

let timelineStore: TimelineEvent[] = [...MOCK_TIMELINE_EVENTS];

export async function getTimelineEvents(caseId?: string): Promise<TimelineEvent[]> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<TimelineEvent[]>(
    `/api/timeline${query}`,
    { method: "GET" },
    () => [...timelineStore]
  );
}

export function getTimelineEventsSync(): TimelineEvent[] {
  return [...timelineStore];
}

export async function addTimelineEvent(event: Omit<TimelineEvent, "id">): Promise<TimelineEvent> {
  return apiClient<TimelineEvent>(
    "/api/timeline",
    { method: "POST", body: JSON.stringify(event) },
    () => {
      const newEvent: TimelineEvent = {
        ...event,
        id: `tl-${timelineStore.length + 1}`,
      };
      timelineStore = [...timelineStore, newEvent];
      return newEvent;
    }
  );
}
