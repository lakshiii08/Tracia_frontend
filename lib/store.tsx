"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MOCK_GRAPH_NODES as seedGraphNodes, MOCK_GRAPH_EDGES as seedGraphEdges } from "@/mocks/graph";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { MOCK_CASES_DATA } from "@/mocks/cases";
import { MOCK_ENTITY_QUEUE } from "@/mocks/entityResolution";
import { MOCK_EVIDENCE_FILES } from "@/mocks/evidence";
import { MOCK_AUDIT_LOGS } from "@/mocks/auditLogs";
import { MOCK_CDR_RECORDS } from "@/mocks/cdr";
import { MOCK_TIMELINE_EVENTS } from "@/mocks/timeline";
import { MOCK_BLOCKCHAIN_RECORDS } from "@/mocks/blockchain";
import { MOCK_CYBER_EVENTS } from "@/mocks/cyberIntel";
import { addCaseApi, updateCaseApi } from "@/services/api/cases";
import { logAuditEvent } from "@/services/api/auditLogs";
import { resolveEntityMatch } from "@/services/api/entityResolution";
import { uploadEvidenceFile } from "@/services/api/evidence";

// ---------- Types (Preserved for 100% Backward Compatibility) ----------

export type CaseStatus = "Active" | "Under Review" | "Closed";

export interface Assignee {
  name: string;
  role: string;
  avatar?: string;
}

export interface CaseItem {
  id: string;
  name: string;
  desc: string;
  entities: number;
  date: string;
  status: CaseStatus;
  tone: "person" | "account" | "outline" | "organization";
  icon: string;
  href?: string;
  assignees?: Assignee[];
}

export interface EntityField {
  label: string;
  value: string;
  matched?: boolean;
}

export interface EntityMatch {
  id: string;
  similarity: number;
  sourceA: string;
  sourceB: string;
  nameA: string;
  nameB: string;
  fieldsA: EntityField[];
  fieldsB: EntityField[];
}

export type EvidenceStatus = "Uploaded" | "OCR Scanning" | "Extracted" | "Indexed";

export interface EvidenceFile {
  id: string;
  filename: string;
  type: string;
  status: EvidenceStatus;
  progress: number;
}

export interface AuditEntry {
  id: string;
  time: string;
  message: string;
  actor: string;
}

export interface CdrRecord {
  id: string;
  caller: string;
  callerName: string;
  receiver: string;
  receiverName: string;
  durationSec: number;
  timestamp: string;
  towerLocation: string;
  crossCaseOverlap: boolean;
}

export interface TimelineEvent {
  id: string;
  time: string;
  date: string;
  title: string;
  category: "Evidence" | "CDR" | "Device" | "Forensics" | "Transfer";
  description: string;
  actor: string;
  evidenceRef?: string;
}

export interface BlockchainRecord {
  evidenceId: string;
  filename: string;
  sha256Hash: string;
  txId: string;
  timestamp: string;
  custodian: string;
  verifiedStatus: "Verified" | "Pending" | "Mismatch";
  history: Array<{ step: string; actor: string; timestamp: string }>;
}

export interface CyberIntelEvent {
  id: string;
  ipAddress: string;
  macAddress: string;
  deviceId: string;
  suspect: string;
  eventType: string;
  domain: string;
  isVpnOrTor: boolean;
  riskScore: number;
  timestamp: string;
}

interface AppDataContextValue {
  cases: CaseItem[];
  addCase: (input: { name: string; desc: string; category: string; priority: string; investigator?: string }) => CaseItem;
  updateCase: (id: string, patch: Partial<Pick<CaseItem, "name" | "desc" | "status">>) => void;

  selectedCaseId: string | null;
  selectedCase: CaseItem | null;
  setSelectedCaseId: (id: string | null) => void;
  selectCase: (id: string | null) => void;

  entityQueue: EntityMatch[];
  totalEntityMatches: number;
  resolveEntity: (id: string, action: "confirm" | "reject") => void;

  evidenceFiles: EvidenceFile[];
  addEvidenceFiles: (files: { filename: string; type: string }[]) => void;

  auditTrail: AuditEntry[];
  resolvedEntities: EntityMatch[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];

  // Neo4j Integration
  neo4jConnected: boolean;
  isNeo4jLoading: boolean;
  neo4jError: string | null;
  currentCypher: string;
  runCypherQuery: (cypher: string) => Promise<void>;
  seedNeo4j: () => Promise<void>;

  // Blueprint Module Data
  cdrRecords: CdrRecord[];
  timelineEvents: TimelineEvent[];
  blockchainRecords: BlockchainRecord[];
  cyberEvents: CyberIntelEvent[];
}

// ---------- Context ----------

const AppDataContext = createContext<AppDataContextValue | null>(null);

let caseCounter = MOCK_CASES_DATA.length;
let evidenceCounter = MOCK_EVIDENCE_FILES.length;
let auditCounter = MOCK_AUDIT_LOGS.length;

function nowStamp() {
  return new Date().toISOString().split("T")[1].replace("Z", "") + "Z";
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(MOCK_CASES_DATA);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [entityQueue, setEntityQueue] = useState<EntityMatch[]>(MOCK_ENTITY_QUEUE);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(MOCK_EVIDENCE_FILES);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(MOCK_AUDIT_LOGS);
  const [resolvedEntities, setResolvedEntities] = useState<EntityMatch[]>([]);

  const selectedCase = useMemo(() => {
    if (!selectedCaseId) return null;
    return cases.find((c) => c.id.toUpperCase() === selectedCaseId.toUpperCase()) || null;
  }, [cases, selectedCaseId]);

  const selectCase = useCallback((id: string | null) => {
    setSelectedCaseId(id);
  }, []);

  // Neo4j State
  const [neo4jConnected, setNeo4jConnected] = useState<boolean>(false);
  const [isNeo4jLoading, setIsNeo4jLoading] = useState<boolean>(false);
  const [neo4jError, setNeo4jError] = useState<string | null>(null);
  const [currentCypher, setCurrentCypher] = useState<string>("MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100");
  const [customNodes, setCustomNodes] = useState<GraphNode[] | null>(null);
  const [customEdges, setCustomEdges] = useState<GraphEdge[] | null>(null);

  // Blueprint Module Data State
  const [cdrRecords] = useState<CdrRecord[]>(MOCK_CDR_RECORDS);
  const [timelineEvents] = useState<TimelineEvent[]>(MOCK_TIMELINE_EVENTS);
  const [blockchainRecords] = useState<BlockchainRecord[]>(MOCK_BLOCKCHAIN_RECORDS);
  const [cyberEvents] = useState<CyberIntelEvent[]>(MOCK_CYBER_EVENTS);

  const pushAudit = useCallback((message: string, actor: string) => {
    auditCounter += 1;
    const entry: AuditEntry = { id: `audit-${auditCounter}`, time: nowStamp(), message, actor };
    setAuditTrail((prev) => [entry, ...prev]);
    // Dispatch to service layer in background
    logAuditEvent(message, actor).catch(() => {});
  }, []);

  const runCypherQuery = useCallback(async (cypher: string) => {
    setIsNeo4jLoading(true);
    setNeo4jError(null);
    setCurrentCypher(cypher);
    try {
      const res = await fetch(`/api/graph?cypher=${encodeURIComponent(cypher)}`);
      const data = await res.json();
      setNeo4jConnected(!!data.connected);
      if (data.error) {
        setNeo4jError(data.error);
      }
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setCustomNodes(data.nodes);
        setCustomEdges(data.edges);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to execute Cypher query";
      setNeo4jError(msg);
      setNeo4jConnected(false);
    } finally {
      setIsNeo4jLoading(false);
    }
  }, []);

  const seedNeo4j = useCallback(async () => {
    setIsNeo4jLoading(true);
    setNeo4jError(null);
    try {
      const res = await fetch("/api/graph/seed", { method: "POST" });
      const data = await res.json();
      if (!data.success) {
        setNeo4jError(data.message || "Failed to seed Neo4j");
      } else {
        pushAudit("Neo4j database seeded with criminal network schema", "SYSTEM");
        await runCypherQuery(currentCypher);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to seed Neo4j";
      setNeo4jError(msg);
    } finally {
      setIsNeo4jLoading(false);
    }
  }, [currentCypher, pushAudit, runCypherQuery]);

  const addCase = useCallback<AppDataContextValue["addCase"]>((input) => {
    caseCounter += 1;
    const toneByCategory: Record<string, CaseItem["tone"]> = {
      kidnapping: "person",
      cyber: "account",
      narcotics: "outline",
      money_laundering: "organization",
      arms: "person",
    };
    const iconByCategory: Record<string, string> = {
      kidnapping: "group",
      cyber: "account_balance",
      narcotics: "local_shipping",
      money_laundering: "domain",
      arms: "military_tech",
    };

    const leadInvestigatorName = input.investigator === "smith"
      ? "Det. J. Smith"
      : input.investigator === "doe"
      ? "Agent R. Doe"
      : "Inspector A. Admin";

    const newCase: CaseItem = {
      id: `CASE_${100 + caseCounter}`,
      name: input.name,
      desc: input.desc || "No initial summary provided.",
      entities: 0,
      date: new Date().toISOString().split("T")[0],
      status: "Active",
      tone: toneByCategory[input.category] ?? "outline",
      icon: iconByCategory[input.category] ?? "folder",
      assignees: [
        { name: leadInvestigatorName, role: "Lead Investigator" },
        { name: "Field Tech 02", role: "Assigned Intelligence Officer" },
      ],
    };
    setCases((prev) => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    pushAudit(`Case created: ${newCase.name} (${newCase.id})`, "Inspector A.");

    // Sync with cases service
    addCaseApi({
      name: input.name,
      desc: input.desc,
      category: input.category,
      priority: (input.priority as "High" | "Medium" | "Critical" | "Low") || "High",
    }).catch(() => {});

    return newCase;
  }, [pushAudit]);

  const updateCase = useCallback<AppDataContextValue["updateCase"]>((id, patch) => {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
    const changed = Object.keys(patch).join(", ");
    pushAudit(`Case updated: ${id} (${changed})`, "Inspector A.");

    // Sync with cases service
    updateCaseApi(id, patch).catch(() => {});
  }, [pushAudit]);

  const resolveEntity = useCallback<AppDataContextValue["resolveEntity"]>((id, action) => {
    setEntityQueue((prev) => {
      const match = prev.find((m) => m.id === id);
      if (match) {
        pushAudit(
          action === "confirm"
            ? `Entity match confirmed: ${match.nameA} ↔ ${match.nameB} (${match.similarity}%)`
            : `Entity match rejected: ${match.nameA} ↔ ${match.nameB}`,
          "Inspector A."
        );
      }
      if (match && action === "confirm") setResolvedEntities((current) => [...current, match]);
      return prev.filter((m) => m.id !== id);
    });

    // Sync with entity resolution service
    resolveEntityMatch(id, action).catch(() => {});
  }, [pushAudit]);

  const addEvidenceFiles = useCallback<AppDataContextValue["addEvidenceFiles"]>((files) => {
    files.forEach((f) => {
      evidenceCounter += 1;
      const id = `evd-${evidenceCounter}`;
      setEvidenceFiles((prev) => [{ id, filename: f.filename, type: f.type, status: "Uploaded", progress: 0 }, ...prev]);
      pushAudit(`Evidence Uploaded: ${f.filename}`, "Inspector A.");

      uploadEvidenceFile({ filename: f.filename, type: f.type }).catch(() => {});

      // Simulate the ingestion pipeline: Uploaded -> OCR Scanning (progress) -> Extracted -> Indexed
      window.setTimeout(() => {
        setEvidenceFiles((prev) => prev.map((e) => (e.id === id ? { ...e, status: "OCR Scanning", progress: 10 } : e)));
        let progress = 10;
        const interval = window.setInterval(() => {
          progress += 30;
          if (progress >= 100) {
            window.clearInterval(interval);
            setEvidenceFiles((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Extracted", progress: 100 } : e)));
            pushAudit(`OCR Extraction Complete: ${f.filename}`, "SYSTEM");
            window.setTimeout(() => {
              setEvidenceFiles((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Indexed" } : e)));
              pushAudit(`Indexed: ${f.filename}`, "SYSTEM");
            }, 900);
          } else {
            setEvidenceFiles((prev) => prev.map((e) => (e.id === id ? { ...e, progress } : e)));
          }
        }, 500);
      }, 600);
    });
  }, [pushAudit]);

  const graph = useMemo(() => {
    const nodes = customNodes ? [...customNodes] : [...seedGraphNodes];
    const edges = customEdges ? [...customEdges] : [...seedGraphEdges];
    const existingNodeIds = new Set(nodes.map((n) => n.id));
    const existingEdgeIds = new Set(edges.map((e) => e.id));

    resolvedEntities.forEach((match) => {
      const aId = `resolved-${match.id}-a`;
      const bId = `resolved-${match.id}-b`;
      const edgeId = `resolved-edge-${match.id}`;

      if (!existingNodeIds.has(aId)) {
        existingNodeIds.add(aId);
        nodes.push({ id: aId, label: match.nameA, type: "person", details: { subtitle: `Resolved from ${match.sourceA}`, idLabel: match.id, connections: 1 } });
      }
      if (!existingNodeIds.has(bId)) {
        existingNodeIds.add(bId);
        nodes.push({ id: bId, label: match.nameB, type: "person", details: { subtitle: `Resolved from ${match.sourceB}`, idLabel: `${match.id}-B`, connections: 1 } });
      }
      if (!existingEdgeIds.has(edgeId)) {
        existingEdgeIds.add(edgeId);
        edges.push({ id: edgeId, from: aId, to: bId, label: `confirmed ${match.similarity}%`, kind: "inferred" });
      }
    });
    return { nodes, edges };
  }, [customNodes, customEdges, resolvedEntities]);

  const value = useMemo<AppDataContextValue>(() => ({
    cases, addCase, updateCase, selectedCaseId, selectedCase, setSelectedCaseId, selectCase,
    entityQueue, totalEntityMatches: MOCK_ENTITY_QUEUE.length, resolveEntity,
    evidenceFiles, addEvidenceFiles, auditTrail, resolvedEntities, graphNodes: graph.nodes, graphEdges: graph.edges,
    neo4jConnected, isNeo4jLoading, neo4jError, currentCypher, runCypherQuery, seedNeo4j,
    cdrRecords, timelineEvents, blockchainRecords, cyberEvents,
  }), [cases, addCase, updateCase, selectedCaseId, selectedCase, selectCase, entityQueue, resolveEntity, evidenceFiles, addEvidenceFiles, auditTrail, resolvedEntities, graph, neo4jConnected, isNeo4jLoading, neo4jError, currentCypher, runCypherQuery, seedNeo4j, cdrRecords, timelineEvents, blockchainRecords, cyberEvents]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
