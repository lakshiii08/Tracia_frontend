import { MOCK_ENTITY_QUEUE } from "@/mocks/entityResolution";
import type { EntityMatch } from "@/lib/store";
import { apiClient } from "@/services/apiClient";

let entityQueueStore: EntityMatch[] = [...MOCK_ENTITY_QUEUE];
let resolvedEntitiesStore: EntityMatch[] = [];

export async function getEntityQueue(): Promise<EntityMatch[]> {
  return apiClient<EntityMatch[]>(
    "/api/entity-resolution/queue",
    { method: "GET" },
    () => [...entityQueueStore]
  );
}

export function getEntityQueueSync(): EntityMatch[] {
  return [...entityQueueStore];
}

export async function resolveEntityMatch(
  id: string,
  action: "confirm" | "reject"
): Promise<{ id: string; action: "confirm" | "reject"; match?: EntityMatch }> {
  return apiClient<{ id: string; action: "confirm" | "reject"; match?: EntityMatch }>(
    `/api/entity-resolution/${id}/resolve`,
    {
      method: "POST",
      body: JSON.stringify({ action }),
    },
    () => {
      const match = entityQueueStore.find((m) => m.id === id);
      if (match && action === "confirm") {
        resolvedEntitiesStore.push(match);
      }
      entityQueueStore = entityQueueStore.filter((m) => m.id !== id);
      return { id, action, match };
    }
  );
}
