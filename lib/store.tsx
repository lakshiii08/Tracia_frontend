"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { graphEdges as seedGraphEdges, graphNodes as seedGraphNodes, type GraphEdge, type GraphNode } from "@/lib/graphData";

// ---------- Types ----------

export type CaseStatus = "Active" | "Under Review" | "Closed";

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

// Blueprint Module Types
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
  addCase: (input: { name: string; desc: string; category: string; priority: string }) => CaseItem;
  updateCase: (id: string, patch: Partial<Pick<CaseItem, "name" | "desc" | "status">>) => void;

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

// ---------- Seed data ----------

const seedCases: CaseItem[] = [
  { id: "TR-102", name: "Operation Nightfall", desc: "Kidnapping & Extortion network across primary metropolitan sectors.", entities: 14, date: "2024-10-27", status: "Active", tone: "person", icon: "group", href: "/case/TR-102" },
  { id: "CASE_209", name: "Cyber Fraud Ring", desc: "Distributed financial siphoning operation targeting institutional accounts.", entities: 32, date: "2024-10-26", status: "Under Review", tone: "account", icon: "account_balance" },
  { id: "CASE_317", name: "Narcotics Transit Route", desc: "Intercepted cross-border smuggling operation.", entities: 8, date: "2024-09-15", status: "Closed", tone: "outline", icon: "local_shipping" },
  { id: "CASE_415", name: "Money Laundering Shells", desc: "Investigation into XYZ Logistics and affiliated shell corporations.", entities: 21, date: "2024-10-28", status: "Active", tone: "organization", icon: "domain" },
];

const seedEntityQueue: EntityMatch[] = [
  {
    id: "match-1",
    similarity: 94,
    sourceA: "FIR_101",
    sourceB: "CDR_RECORDS",
    nameA: "Vikram Sharma",
    nameB: "V. Sharma",
    fieldsA: [
      { label: "Full Name", value: "Vikram Sharma" },
      { label: "Date of Birth", value: "12 Oct 1985 (39 Yrs)" },
      { label: "Phone Number", value: "+91 9876543210" },
      { label: "Primary Address", value: "Apt 4B, Andheri West, Mumbai" },
    ],
    fieldsB: [
      { label: "Full Name", value: "V. Sharma", matched: true },
      { label: "Date of Birth", value: "1985-10-12", matched: true },
      { label: "Phone Number", value: "+91 9876543210", matched: true },
      { label: "Primary Address", value: "No Data Available" },
    ],
  },
  {
    id: "match-2",
    similarity: 87,
    sourceA: "SURVEILLANCE_09",
    sourceB: "VEHICLE_RECORDS",
    nameA: "Rahul Sharma",
    nameB: "R. Sharma",
    fieldsA: [
      { label: "Full Name", value: "Rahul Sharma" },
      { label: "Date of Birth", value: "03 Feb 1990 (35 Yrs)" },
      { label: "Phone Number", value: "+91 9012345678" },
      { label: "Primary Address", value: "Sector 12, Navi Mumbai" },
    ],
    fieldsB: [
      { label: "Full Name", value: "R. Sharma", matched: true },
      { label: "Date of Birth", value: "1990-02-03", matched: true },
      { label: "Phone Number", value: "No Data Available" },
      { label: "Primary Address", value: "Sector 12, Navi Mumbai", matched: true },
    ],
  },
];

const seedEvidence: EvidenceFile[] = [
  { id: "evd-seed-1", filename: "cdr_dump_q1.csv", type: "CDR", status: "Indexed", progress: 100 },
  { id: "evd-seed-2", filename: "bank_statement_jan.xlsx", type: "FINANCIAL", status: "Extracted", progress: 100 },
  { id: "evd-seed-3", filename: "incident_report_01.pdf", type: "FIR", status: "Indexed", progress: 100 },
];

const seedAudit: AuditEntry[] = [
  { id: "audit-1", time: "13:55:12.901Z", message: "Evidence Ingested — Batch ID: BTCH_994A", actor: "INV-4492" },
  { id: "audit-2", time: "13:58:44.210Z", message: "OCR Extraction Complete — incident_report_01.pdf", actor: "SYSTEM" },
  { id: "audit-3", time: "14:02:18.004Z", message: "Entity Resolved: PER_8922 — high confidence match across 3 sources", actor: "INV-4492" },
];

const seedCdr: CdrRecord[] = [
  { id: "cdr-101", caller: "+91 9123456780", callerName: "Person A (Burner)", receiver: "+91 9876543210", receiverName: "Vikram Sharma", durationSec: 342, timestamp: "2025-05-10 09:14:22", towerLocation: "Andheri East Tower #14", crossCaseOverlap: true },
  { id: "cdr-102", caller: "+91 9876543210", callerName: "Vikram Sharma", receiver: "+91 9012345678", receiverName: "Rahul Sharma", durationSec: 120, timestamp: "2025-05-10 09:45:10", towerLocation: "Bandra Kurla Complex Tower #03", crossCaseOverlap: true },
  { id: "cdr-103", caller: "+91 9012345678", callerName: "Rahul Sharma", receiver: "+91 9988776655", receiverName: "Priya Nair", durationSec: 512, timestamp: "2025-05-10 10:12:00", towerLocation: "Colaba South Tower #09", crossCaseOverlap: false },
  { id: "cdr-104", caller: "+91 9123456780", callerName: "Person A (Burner)", receiver: "+91 9988776655", receiverName: "Priya Nair", durationSec: 88, timestamp: "2025-05-10 11:30:45", towerLocation: "Navi Mumbai Tower #21", crossCaseOverlap: true },
];

const seedTimeline: TimelineEvent[] = [
  { id: "tl-1", time: "09:00:00", date: "2025-05-10", title: "Evidence Collected", category: "Evidence", description: "CCTV footage & seized mobile phone recovered from primary crime scene.", actor: "Officer A", evidenceRef: "EVD_101" },
  { id: "tl-2", time: "09:45:10", date: "2025-05-10", title: "Encrypted CDR Call Intercepted", category: "CDR", description: "Call duration 342s between Burner (+91 9123456780) and Vikram Sharma.", actor: "SYSTEM", evidenceRef: "CDR_DUMP_Q1" },
  { id: "tl-3", time: "11:00:00", date: "2025-05-10", title: "Device Activity Logged", category: "Device", description: "Device ID DEV_992 connected from IP 185.220.101.5 (TOR Exit Node).", actor: "SYSTEM" },
  { id: "tl-4", time: "13:30:00", date: "2025-05-10", title: "Forensic Analysis Complete", category: "Forensics", description: "Extracted memory dump & SHA-256 hash generated for evidence verification.", actor: "Forensic Expert B", evidenceRef: "FOR_REPORT_882" },
  { id: "tl-5", time: "15:00:00", date: "2025-05-10", title: "Chain of Custody Handover", category: "Transfer", description: "Physical evidence transferred to Secure Court Custody Vault.", actor: "Custodian Officer C", evidenceRef: "EVD_101" },
];

const seedBlockchain: BlockchainRecord[] = [
  {
    evidenceId: "EVD_101",
    filename: "incident_report_01.pdf",
    sha256Hash: "a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
    txId: "0x7f8a3291bc409a12e345b6789c01234567890abc",
    timestamp: "2025-05-10 09:05:12 Z",
    custodian: "Inspector A (INV-4492)",
    verifiedStatus: "Verified",
    history: [
      { step: "Evidence Collected", actor: "Officer A", timestamp: "2025-05-10 09:00:00 Z" },
      { step: "SHA-256 Hash Generated & Stored on Blockchain", actor: "SYSTEM", timestamp: "2025-05-10 09:05:12 Z" },
      { step: "Transferred to Forensic Expert B", actor: "Forensic Expert B", timestamp: "2025-05-10 13:30:00 Z" },
      { step: "Transferred to Secure Custodian Vault", actor: "Custodian Officer C", timestamp: "2025-05-10 15:00:00 Z" },
    ],
  },
  {
    evidenceId: "EVD_102",
    filename: "cdr_dump_q1.csv",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    txId: "0x3b91a827c6014e9921b345a678901234567890ef",
    timestamp: "2025-05-10 10:00:00 Z",
    custodian: "Analyst 01",
    verifiedStatus: "Verified",
    history: [
      { step: "CDR Data Ingested", actor: "Analyst 01", timestamp: "2025-05-10 10:00:00 Z" },
      { step: "SHA-256 Hash Verified", actor: "SYSTEM", timestamp: "2025-05-10 10:02:00 Z" },
    ],
  },
];

const seedCyberEvents: CyberIntelEvent[] = [
  { id: "CYBER_01", ipAddress: "185.220.101.5", macAddress: "00:1A:2B:3C:4D:5E", deviceId: "DEV_MACBOOK_PRO", suspect: "Person A", eventType: "TOR Exit Node Connection", domain: "darkmarket-node.onion", isVpnOrTor: true, riskScore: 92, timestamp: "2025-05-10 11:00:00" },
  { id: "CYBER_02", ipAddress: "192.168.1.104", macAddress: "A4:C3:F0:12:34:56", deviceId: "DEV_IPHONE_14", suspect: "Vikram Sharma", eventType: "Unauthorized Bank Portal Access", domain: "secure-banking-portal.com", isVpnOrTor: false, riskScore: 78, timestamp: "2025-05-10 12:15:30" },
  { id: "CYBER_03", ipAddress: "45.154.255.88", macAddress: "B2:77:88:99:AA:BB", deviceId: "DEV_ANDROID_TAB", suspect: "Rahul Sharma", eventType: "Encrypted Telegram Channel Activity", domain: "t.me/privatesignal", isVpnOrTor: true, riskScore: 85, timestamp: "2025-05-10 14:05:10" },
];

// ---------- Context ----------

const AppDataContext = createContext<AppDataContextValue | null>(null);

let caseCounter = seedCases.length;
let evidenceCounter = 0;
let auditCounter = seedAudit.length;

function nowStamp() {
  return new Date().toISOString().split("T")[1].replace("Z", "") + "Z";
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseItem[]>(seedCases);
  const [entityQueue, setEntityQueue] = useState<EntityMatch[]>(seedEntityQueue);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>(seedEvidence);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(seedAudit);
  const [resolvedEntities, setResolvedEntities] = useState<EntityMatch[]>([]);

  // Neo4j State
  const [neo4jConnected, setNeo4jConnected] = useState<boolean>(false);
  const [isNeo4jLoading, setIsNeo4jLoading] = useState<boolean>(false);
  const [neo4jError, setNeo4jError] = useState<string | null>(null);
  const [currentCypher, setCurrentCypher] = useState<string>("MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100");
  const [customNodes, setCustomNodes] = useState<GraphNode[] | null>(null);
  const [customEdges, setCustomEdges] = useState<GraphEdge[] | null>(null);

  // Blueprint Module Data State
  const [cdrRecords] = useState<CdrRecord[]>(seedCdr);
  const [timelineEvents] = useState<TimelineEvent[]>(seedTimeline);
  const [blockchainRecords] = useState<BlockchainRecord[]>(seedBlockchain);
  const [cyberEvents] = useState<CyberIntelEvent[]>(seedCyberEvents);

  const pushAudit = useCallback((message: string, actor: string) => {
    auditCounter += 1;
    setAuditTrail((prev) => [{ id: `audit-${auditCounter}`, time: nowStamp(), message, actor }, ...prev]);
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
    const newCase: CaseItem = {
      id: `CASE_${100 + caseCounter}`,
      name: input.name,
      desc: input.desc || "No initial summary provided.",
      entities: 0,
      date: new Date().toISOString().split("T")[0],
      status: "Active",
      tone: toneByCategory[input.category] ?? "outline",
      icon: iconByCategory[input.category] ?? "folder",
    };
    setCases((prev) => [newCase, ...prev]);
    pushAudit(`Case created: ${newCase.name} (${newCase.id})`, "Inspector A.");
    return newCase;
  }, [pushAudit]);

  const updateCase = useCallback<AppDataContextValue["updateCase"]>((id, patch) => {
    setCases((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
    const changed = Object.keys(patch).join(", ");
    pushAudit(`Case updated: ${id} (${changed})`, "Inspector A.");
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
  }, [pushAudit]);

  const addEvidenceFiles = useCallback<AppDataContextValue["addEvidenceFiles"]>((files) => {
    files.forEach((f) => {
      evidenceCounter += 1;
      const id = `evd-${evidenceCounter}`;
      setEvidenceFiles((prev) => [{ id, filename: f.filename, type: f.type, status: "Uploaded", progress: 0 }, ...prev]);
      pushAudit(`Evidence Uploaded: ${f.filename}`, "Inspector A.");

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
    resolvedEntities.forEach((match) => {
      const aId = `resolved-${match.id}-a`;
      const bId = `resolved-${match.id}-b`;
      nodes.push({ id: aId, label: match.nameA, type: "person", details: { subtitle: `Resolved from ${match.sourceA}`, idLabel: match.id, connections: 1 } });
      nodes.push({ id: bId, label: match.nameB, type: "person", details: { subtitle: `Resolved from ${match.sourceB}`, idLabel: `${match.id}-B`, connections: 1 } });
      edges.push({ id: `resolved-edge-${match.id}`, from: aId, to: bId, label: `confirmed ${match.similarity}%`, kind: "inferred" });
    });
    return { nodes, edges };
  }, [customNodes, customEdges, resolvedEntities]);

  const value = useMemo<AppDataContextValue>(() => ({
    cases, addCase, updateCase, entityQueue, totalEntityMatches: seedEntityQueue.length, resolveEntity,
    evidenceFiles, addEvidenceFiles, auditTrail, resolvedEntities, graphNodes: graph.nodes, graphEdges: graph.edges,
    neo4jConnected, isNeo4jLoading, neo4jError, currentCypher, runCypherQuery, seedNeo4j,
    cdrRecords, timelineEvents, blockchainRecords, cyberEvents,
  }), [cases, addCase, updateCase, entityQueue, resolveEntity, evidenceFiles, addEvidenceFiles, auditTrail, resolvedEntities, graph, neo4jConnected, isNeo4jLoading, neo4jError, currentCypher, runCypherQuery, seedNeo4j, cdrRecords, timelineEvents, blockchainRecords, cyberEvents]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
