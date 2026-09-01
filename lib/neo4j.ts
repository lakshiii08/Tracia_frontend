import neo4j, { Driver, Integer, Node, Relationship } from "neo4j-driver";
import { GraphNode, GraphEdge, EntityType, graphNodes as fallbackNodes, graphEdges as fallbackEdges } from "./graphData";

const NEO4J_URI = process.env.NEO4J_URI || "bolt://localhost:7687";
const NEO4J_USER = process.env.NEO4J_USERNAME || process.env.NEO4J_USER || "neo4j";
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || "password";
const NEO4J_DATABASE = process.env.NEO4J_DATABASE || "neo4j";

let driverInstance: Driver | null = null;

export function getNeo4jDriver(): Driver | null {
  if (!driverInstance && process.env.NEO4J_URI) {
    try {
      driverInstance = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD),
        { disableLosslessIntegers: true }
      );
    } catch {
      driverInstance = null;
    }
  }
  return driverInstance;
}

export async function checkNeo4jConnection(): Promise<boolean> {
  const driver = getNeo4jDriver();
  if (!driver) return false;
  try {
    await driver.verifyConnectivity({ database: NEO4J_DATABASE });
    return true;
  } catch {
    return false;
  }
}

// Convert Neo4j values to standard JS types (handles Neo4j Integers if any)
function toNative(val: unknown): unknown {
  if (val === null || val === undefined) return val;
  if (typeof val === "object" && val !== null && "low" in val && "high" in val) {
    return (val as Integer).toNumber();
  }
  if (Array.isArray(val)) return val.map(toNative);
  if (typeof val === "object" && val !== null) {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = toNative(v);
    }
    return res;
  }
  return val;
}

function parseNeo4jNode(node: Node): GraphNode {
  const props = (toNative(node.properties) as Record<string, unknown>) || {};
  const labels = node.labels || [];
  
  const rawType = (props.type as string) || labels[0]?.toLowerCase() || "person";
  const validTypes: EntityType[] = ["person", "phone", "vehicle", "location", "organization", "account", "case", "evidence"];
  const type: EntityType = validTypes.includes(rawType as EntityType) ? (rawType as EntityType) : "person";

  const detailsObj = (props.details as GraphNode["details"]) || {
    subtitle: (props.subtitle as string) || (props.description as string) || undefined,
    idLabel: (props.idLabel as string) || node.elementId || String(node.identity),
    connections: typeof props.connections === "number" ? props.connections : undefined,
    evidenceCount: typeof props.evidenceCount === "number" ? props.evidenceCount : undefined,
    caseCount: typeof props.caseCount === "number" ? props.caseCount : undefined,
    riskScore: typeof props.riskScore === "number" ? props.riskScore : undefined,
  };

  return {
    id: (props.id as string) || node.elementId || String(node.identity),
    label: (props.label as string) || (props.name as string) || `Node ${node.identity}`,
    type,
    risk: (props.risk as "high" | "medium" | "low") || undefined,
    details: detailsObj,
  };
}

function parseNeo4jRelationship(rel: Relationship): GraphEdge {
  const props = (toNative(rel.properties) as Record<string, unknown>) || {};
  const kind = (props.kind as GraphEdge["kind"]) || "direct";

  return {
    id: (props.id as string) || rel.elementId || String(rel.identity),
    from: String(rel.startNodeElementId || rel.start),
    to: String(rel.endNodeElementId || rel.end),
    label: (props.label as string) || rel.type.toLowerCase().replace(/_/g, " "),
    kind,
  };
}

export async function queryGraphFromNeo4j(cypherQuery?: string): Promise<{
  connected: boolean;
  cypher: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  error?: string;
}> {
  const defaultCypher = "MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100";
  const queryToRun = cypherQuery && cypherQuery.trim() ? cypherQuery : defaultCypher;

  const connected = await checkNeo4jConnection();
  if (!connected) {
    return {
      connected: false,
      cypher: queryToRun,
      nodes: fallbackNodes,
      edges: fallbackEdges,
      error: "Neo4j database not connected. Displaying local fallback intelligence graph.",
    };
  }

  const driver = getNeo4jDriver();
  if (!driver) {
    return {
      connected: false,
      cypher: queryToRun,
      nodes: fallbackNodes,
      edges: fallbackEdges,
      error: "Failed to initialize Neo4j driver.",
    };
  }

  const session = driver.session({ database: NEO4J_DATABASE });
  try {
    const result = await session.run(queryToRun);
    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();

    for (const record of result.records) {
      for (const key of record.keys) {
        const item = record.get(key);
        if (!item) continue;

        // Check if item is a Node
        if (typeof item === "object" && "labels" in item && "properties" in item) {
          const parsedNode = parseNeo4jNode(item as Node);
          nodeMap.set(parsedNode.id, parsedNode);
        }

        // Check if item is a Relationship
        if (typeof item === "object" && "type" in item && "start" in item && "end" in item) {
          const rel = item as Relationship;
          const startId = String(rel.startNodeElementId || rel.start);
          const endId = String(rel.endNodeElementId || rel.end);

          const parsedEdge: GraphEdge = {
            id: (rel.properties?.id as string) || rel.elementId || String(rel.identity),
            from: startId,
            to: endId,
            label: (rel.properties?.label as string) || rel.type.toLowerCase().replace(/_/g, " "),
            kind: (rel.properties?.kind as GraphEdge["kind"]) || "direct",
          };
          edgeMap.set(parsedEdge.id, parsedEdge);
        }

        // Check if item is a Path
        if (typeof item === "object" && "segments" in item) {
          const path = item as { segments: Array<{ start: Node; relationship: Relationship; end: Node }> };
          for (const seg of path.segments) {
            const startNode = parseNeo4jNode(seg.start);
            const endNode = parseNeo4jNode(seg.end);
            nodeMap.set(startNode.id, startNode);
            nodeMap.set(endNode.id, endNode);

            const parsedEdge = parseNeo4jRelationship(seg.relationship);
            parsedEdge.from = startNode.id;
            parsedEdge.to = endNode.id;
            edgeMap.set(parsedEdge.id, parsedEdge);
          }
        }
      }
    }

    return {
      connected: true,
      cypher: queryToRun,
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: true,
      cypher: queryToRun,
      nodes: fallbackNodes,
      edges: fallbackEdges,
      error: `Cypher Execution Error: ${errorMsg}`,
    };
  } finally {
    await session.close();
  }
}

export async function seedNeo4jData(): Promise<{ success: boolean; message: string }> {
  const connected = await checkNeo4jConnection();
  if (!connected) {
    return { success: false, message: "Cannot seed: Neo4j database is not connected." };
  }

  const driver = getNeo4jDriver();
  if (!driver) return { success: false, message: "Neo4j driver uninitialized." };

  const session = driver.session({ database: NEO4J_DATABASE });
  try {
    // Clear existing nodes and relationships
    await session.run("MATCH (n) DETACH DELETE n");

    // Create Nodes
    for (const node of fallbackNodes) {
      // Use safe standard Cypher MERGE/CREATE without APOC dependency
      await session.run(
        `
        MERGE (n:Entity { id: $id })
        SET n.label = $label,
            n.type = $type,
            n.risk = $risk,
            n.subtitle = $subtitle,
            n.idLabel = $idLabel,
            n.connections = $connections,
            n.evidenceCount = $evidenceCount,
            n.caseCount = $caseCount,
            n.riskScore = $riskScore
        `,
        {
          id: node.id,
          label: node.label,
          type: node.type,
          risk: node.risk || null,
          subtitle: node.details.subtitle || null,
          idLabel: node.details.idLabel || null,
          connections: node.details.connections || null,
          evidenceCount: node.details.evidenceCount || null,
          caseCount: node.details.caseCount || null,
          riskScore: node.details.riskScore || null,
        }
      );
    }

    // Create Relationships
    for (const edge of fallbackEdges) {
      await session.run(
        `
        MATCH (a:Entity { id: $from })
        MATCH (b:Entity { id: $to })
        MERGE (a)-[r:RELATIONSHIP { id: $id }]->(b)
        SET r.label = $label,
            r.kind = $kind
        `,
        {
          id: edge.id,
          from: edge.from,
          to: edge.to,
          label: edge.label,
          kind: edge.kind,
        }
      );
    }

    return { success: true, message: `Successfully seeded Neo4j database with ${fallbackNodes.length} nodes and ${fallbackEdges.length} relationships.` };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Seed error: ${errorMsg}` };
  } finally {
    await session.close();
  }
}
