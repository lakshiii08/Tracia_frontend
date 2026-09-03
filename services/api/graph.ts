import { MOCK_GRAPH_NODES, MOCK_GRAPH_EDGES, MOCK_DATA_SOURCE_COUNTS, MOCK_GRAPH_PRESETS } from "@/mocks/graph";
import type { GraphNode, GraphEdge, DataSourceCounts, GraphPreset } from "@/types/graph";
import { apiClient } from "@/services/apiClient";

let customNodesStore: GraphNode[] = [...MOCK_GRAPH_NODES];
let customEdgesStore: GraphEdge[] = [...MOCK_GRAPH_EDGES];

export async function getGraphData(caseId?: string): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<{ nodes: GraphNode[]; edges: GraphEdge[] }>(
    `/api/graph/data${query}`,
    { method: "GET" },
    () => ({ nodes: [...customNodesStore], edges: [...customEdgesStore] })
  );
}

export function getGraphDataSync(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  return { nodes: [...customNodesStore], edges: [...customEdgesStore] };
}

export async function getDataSourceCounts(caseId?: string): Promise<DataSourceCounts> {
  const query = caseId ? `?caseId=${encodeURIComponent(caseId)}` : "";
  return apiClient<DataSourceCounts>(
    `/api/graph/sources${query}`,
    { method: "GET" },
    () => ({ ...MOCK_DATA_SOURCE_COUNTS })
  );
}

export async function getGraphPresets(): Promise<GraphPreset[]> {
  return apiClient<GraphPreset[]>(
    "/api/graph/presets",
    { method: "GET" },
    () => [...MOCK_GRAPH_PRESETS]
  );
}

export async function runCypherQuery(cypher: string): Promise<{
  connected: boolean;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  error?: string;
}> {
  return apiClient<{
    connected: boolean;
    nodes?: GraphNode[];
    edges?: GraphEdge[];
    error?: string;
  }>(
    `/api/graph?cypher=${encodeURIComponent(cypher)}`,
    { method: "GET" },
    () => ({
      connected: false,
      nodes: [...customNodesStore],
      edges: [...customEdgesStore],
    })
  );
}

export async function seedNeo4jDatabase(): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(
    "/api/graph/seed",
    { method: "POST" },
    () => ({
      success: true,
      message: "Neo4j database seeded with criminal network schema (local fallback active).",
    })
  );
}
