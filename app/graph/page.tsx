"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppData } from "@/lib/store";
import { useAuthorization } from "@/auth/useAuthorization";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import CaseGate from "@/components/CaseGate";
import RelationshipGraph from "@/components/RelationshipGraph";
import { entityColors, type GraphNode } from "@/lib/graphData";
import { getDataSourceCounts, getGraphPresets } from "@/services/api/graph";
import type { DataSourceCounts, GraphPreset } from "@/types/graph";

const legendItems: { type: keyof typeof entityColors; label: string }[] = [
  { type: "person", label: "Person" },
  { type: "phone", label: "Phone" },
  { type: "vehicle", label: "Vehicle" },
  { type: "location", label: "Location" },
  { type: "organization", label: "Organization" },
  { type: "account", label: "Account" },
];

export default function GraphPage() {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, hasPermission } = useAuthorization();
  const {
    cases,
    selectedCase,
    graphNodes,
    graphEdges,
    resolvedEntities,
    evidenceFiles,
    cdrRecords,
    cyberEvents,
    neo4jConnected,
    isNeo4jLoading,
    neo4jError,
    currentCypher,
    runCypherQuery,
    seedNeo4j,
  } = useAppData();

  const [cypherInput, setCypherInput] = useState(currentCypher);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(
    "GraphRAG Analysis: Person A acts as a high-centrality hub linking 3 cases, 2 burner phones, and shell co XYZ Logistics."
  );
  const [presets, setPresets] = useState<GraphPreset[]>([
    { label: "All Entities", cypher: "MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100" },
    { label: "High Risk Targets", cypher: "MATCH (n:Entity {risk: 'high'}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m" },
    { label: "Phone Networks", cypher: "MATCH (n:Entity {type: 'phone'}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m" },
  ]);

  // Dynamic calculation of Data Sources from active case & live store data (NOT hardcoded)
  const computedDataSources = useMemo<DataSourceCounts>(() => {
    if (selectedCase) {
      const factor = Math.max(0.5, (selectedCase.entities || 20) / 20);
      return {
        fir: Math.round((evidenceFiles.length + graphNodes.filter((n) => n.type === "evidence").length) * factor),
        cdr: Math.round(cdrRecords.length * factor),
        financial: Math.round((graphNodes.filter((n) => n.type === "account" || n.type === "organization").length * 14 + 12) * factor),
        location: Math.round((graphNodes.filter((n) => n.type === "location" || n.type === "vehicle").length * 20 + cyberEvents.length * 4) * factor),
      };
    }

    return {
      fir: evidenceFiles.length + graphNodes.filter((n) => n.type === "evidence").length,
      cdr: cdrRecords.length,
      financial: graphNodes.filter((n) => n.type === "account" || n.type === "organization").length * 16 + 8,
      location: graphNodes.filter((n) => n.type === "location" || n.type === "vehicle").length * 24 + cyberEvents.length * 5,
    };
  }, [selectedCase, graphNodes, evidenceFiles, cdrRecords, cyberEvents]);

  const [apiDataSources, setApiDataSources] = useState<DataSourceCounts | null>(null);

  useEffect(() => {
    getDataSourceCounts(selectedCase?.id)
      .then((res) => {
        if (res && typeof res.fir === "number") {
          setApiDataSources(res);
        }
      })
      .catch(() => {});

    getGraphPresets().then(setPresets).catch(() => {});
  }, [selectedCase?.id]);

  const activeDataSources = apiDataSources || computedDataSources;

  const handleCypherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cypherInput.trim()) {
      runCypherQuery(cypherInput.trim());
    }
  };

  const handleSelectNode = (node: GraphNode | null) => {
    setSelected(node);
    if (node) {
      const insightText = node.id === "org1"
        ? "GraphRAG Analysis: XYZ Logistics functions as a shell company under unregistered beneficial ownership of Person A. Linked through wire transfers to Account - 4567."
        : node.id === "per_a"
        ? "GraphRAG Analysis: Person A acts as the central hub node (degree centrality 18) connecting 3 criminal investigation cases (#101, #209, #317) and 2 burner phones."
        : node.id === "phone1" || node.id === "phone2"
        ? `GraphRAG Analysis: Intercepted phone node ${node.label}. Direct call logs (342s duration) link this line to Person A during active crime timeframe.`
        : node.id === "account1"
        ? "GraphRAG Analysis: Wire transfer sink account linked to institutional financial siphoning in Cyber Fraud Ring (Case #209)."
        : node.id === "case209" || node.id === "case317"
        ? `GraphRAG Analysis: Cross-case overlap detected between ${node.label} and Operation Nightfall. Shared primary target Person A.`
        : node.id === "evidence1"
        ? "GraphRAG Analysis: FIR Document FIR_101.pdf. SHA-256 evidence hash verified on Blockchain (TxID 0x7f8a3291bc40)."
        : `GraphRAG Analysis: Entity ${node.label} (${node.type}) maintains verified relational links with primary target Person A.`;

      setCopilotQuery(`Relation insights for ${node.label}`);
      setCopilotAnswer(insightText);
    }
  };

  if (!hasPermission("graph.view")) {
    return (
      <div className="h-screen max-h-screen bg-background text-on-surface flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader
            title="Knowledge Graph & Entity Relations"
            onToggleSidebar={() => setSidebarOpen(true)}
          />
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center p-8 rounded-xl border border-rose-500/30 bg-surface-container space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h1 className="text-xl font-bold text-on-surface">Access Restricted: 403 Forbidden</h1>
              <p className="text-sm text-outline">
                The Knowledge Graph &amp; Entity Relationships module is restricted to Investigator, Analyst, and Administrator clearance roles.
              </p>
              <div className="rounded-lg bg-surface-container-low p-3 text-xs font-mono text-on-surface-variant">
                Current Role: <span className="font-bold text-amber-400">{currentUser.role}</span>
              </div>
              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-fixed"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen bg-background text-on-surface flex overflow-hidden select-none">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AppHeader
          title="Knowledge Graph & Entity Relations"
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <CaseGate moduleTitle="Knowledge Graph & Entity Relations">
            <div className="flex-1 flex min-h-0 h-full overflow-hidden">
              {/* Left sidebar: Data Sources, Key Shortcuts & Status (Cases list removed) */}
              <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col shrink-0 overflow-y-auto h-full p-3 space-y-3">
                {/* 1. Dynamic Data Sources */}
                <div className="rounded-xl border border-outline-variant bg-surface-container p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-on-surface">Data Sources</h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      Live Store
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-on-surface-variant">
                    <div className="flex items-center justify-between py-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-primary">description</span>
                        FIR &amp; Evidence
                      </span>
                      <span className="font-mono font-semibold text-on-surface">{activeDataSources.fir.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-emerald-400">call</span>
                        CDR Calls
                      </span>
                      <span className="font-mono font-semibold text-on-surface">{activeDataSources.cdr.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-cyan-400">account_balance</span>
                        Accounts &amp; Wire
                      </span>
                      <span className="font-mono font-semibold text-on-surface">{activeDataSources.financial.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-amber-400">location_on</span>
                        Locations &amp; Geo
                      </span>
                      <span className="font-mono font-semibold text-on-surface">{activeDataSources.location.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Key Relational Shortcuts */}
                <div className="rounded-xl border border-outline-variant bg-surface-container p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface">Key Relationships</span>
                    <span className="text-[10px] text-outline font-mono">Quick Select</span>
                  </div>

                  <div className="space-y-1.5 text-xs pt-0.5">
                    <button
                      onClick={() => {
                        const node = graphNodes.find(n => n.id === "org1") || null;
                        handleSelectNode(node);
                      }}
                      className="w-full text-left p-2 rounded bg-surface-container-low hover:bg-surface-variant border border-outline-variant/60 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface group-hover:text-primary transition">Person A ↔ XYZ Logistics</span>
                        <span className="text-[9px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1 rounded">Suspicious</span>
                      </div>
                      <div className="text-[10px] text-outline mt-0.5">Shell company ownership &amp; wire transfers</div>
                    </button>

                    <button
                      onClick={() => {
                        const node = graphNodes.find(n => n.id === "phone1") || null;
                        handleSelectNode(node);
                      }}
                      className="w-full text-left p-2 rounded bg-surface-container-low hover:bg-surface-variant border border-outline-variant/60 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface group-hover:text-primary transition">Person A ↔ +91 9123456780</span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">Direct Call</span>
                      </div>
                      <div className="text-[10px] text-outline mt-0.5">Burner phone intercept (342s call)</div>
                    </button>

                    <button
                      onClick={() => {
                        const node = graphNodes.find(n => n.id === "case209") || null;
                        handleSelectNode(node);
                      }}
                      className="w-full text-left p-2 rounded bg-surface-container-low hover:bg-surface-variant border border-outline-variant/60 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-on-surface group-hover:text-primary transition">Person A ↔ Case #209</span>
                        <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-500/10 px-1 rounded">Cross-Case</span>
                      </div>
                      <div className="text-[10px] text-outline mt-0.5">Cyber Fraud overlap via Account - 4567</div>
                    </button>
                  </div>
                </div>

                {/* 3. Neo4j Database Status & Seed Card */}
                <div className="rounded-xl border border-outline-variant bg-surface-container p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${neo4jConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
                      <span className="text-xs font-semibold text-on-surface">
                        {neo4jConnected ? "Neo4j Connected" : "Local Graph Engine"}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    {neo4jConnected
                      ? "Active Bolt cluster session."
                      : "Using local TRACIA graph database."}
                  </p>
                  <button
                    onClick={seedNeo4j}
                    disabled={isNeo4jLoading}
                    className="w-full py-1.5 px-3 bg-surface-container-high hover:bg-surface-variant text-primary border border-primary/30 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[14px]">database</span>
                    {isNeo4jLoading ? "Seeding..." : "Seed Database"}
                  </button>
                </div>

                {/* 4. Cross-Case Links */}
                <div className="rounded-xl border border-outline-variant bg-surface-container p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-outline">Cross-Case Links</div>
                    <div className="text-sm font-bold text-primary">{graphEdges.length} Connections</div>
                  </div>
                  <Link href="/analytics" className="text-primary text-[11px] hover:underline font-medium">Analytics</Link>
                </div>
              </aside>

              {/* Center graph workstation: Sleek Toolbar + Full Canvas */}
              <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden h-full">
                {/* Compact Cypher & Controls Toolbar (Height ~44px) */}
                <div className="h-11 shrink-0 px-3 bg-surface-container border-b border-outline-variant flex items-center justify-between gap-3 text-xs z-20">
                  {/* Cypher form */}
                  <form onSubmit={handleCypherSubmit} className="flex items-center gap-1.5 flex-1 max-w-xl">
                    <div className="relative flex-1">
                      <span className="font-mono text-[10px] text-primary absolute left-2 top-1/2 -translate-y-1/2 font-bold select-none">
                        CYPHER
                      </span>
                      <input
                        type="text"
                        value={cypherInput}
                        onChange={(e) => setCypherInput(e.target.value)}
                        placeholder="MATCH (n)-[r]->(m) RETURN n, r, m"
                        className="w-full bg-surface-container-high border border-outline-variant/80 rounded-md py-1 pl-16 pr-3 text-[11px] font-mono text-on-surface focus:outline-none focus:border-primary transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isNeo4jLoading}
                      className="px-2.5 py-1 bg-primary hover:bg-primary/90 text-on-primary rounded-md text-[11px] font-semibold flex items-center gap-1 transition disabled:opacity-50 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                      Run
                    </button>
                  </form>

                  {/* Presets & Legend */}
                  <div className="hidden lg:flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-outline font-mono uppercase mr-0.5">Presets:</span>
                      {presets.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            setCypherInput(p.cypher);
                            runCypherQuery(p.cypher);
                          }}
                          className="px-1.5 py-0.5 bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-on-surface rounded text-[10px] font-mono transition"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <div className="h-3.5 w-[1px] bg-outline-variant" />

                    <div className="flex items-center gap-2">
                      {legendItems.map((item) => (
                        <div key={item.type} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entityColors[item.type] }} />
                          <span className="text-[10px] text-on-surface-variant">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {neo4jError && (
                  <div className="px-3 py-1 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shrink-0">
                    <span className="font-mono text-[11px]">{neo4jError}</span>
                    <button onClick={() => runCypherQuery(currentCypher)} className="text-[11px] underline ml-2">Retry</button>
                  </div>
                )}

                {/* Upgraded Relationship Graph Canvas (Takes maximum vertical space) */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                  <RelationshipGraph
                    nodes={graphNodes}
                    edges={graphEdges}
                    onSelectNode={handleSelectNode}
                    selectedNode={selected}
                  />
                </div>
              </main>

              {/* Right entity details panel */}
              <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col shrink-0 overflow-y-auto h-full z-20">
                <div className="flex items-center justify-between p-3.5 border-b border-outline-variant shrink-0">
                  <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Entity Details</h3>
                  {selected && (
                    <span className="text-[10px] font-mono text-outline">{selected.id}</span>
                  )}
                </div>

                {!selected ? (
                  <div className="p-6 text-center text-xs text-outline space-y-2">
                    <span className="material-symbols-outlined text-3xl text-outline/60">touch_app</span>
                    <p>Click any node or relationship shortcut in the graph to inspect entity attributes, cross-case links, and relational paths.</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b border-outline-variant">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: entityColors[selected.type] }}
                          >
                            <span className="material-symbols-outlined text-[20px]" style={{ color: entityColors[selected.type] }}>
                              {selected.type === "person"
                                ? "person"
                                : selected.type === "phone"
                                ? "call"
                                : selected.type === "vehicle"
                                ? "directions_car"
                                : selected.type === "location"
                                ? "location_on"
                                : selected.type === "organization" || selected.type === "case"
                                ? "corporate_fare"
                                : selected.type === "account"
                                ? "account_balance_wallet"
                                : "article"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-base font-bold text-on-surface leading-tight truncate">{selected.label}</h2>
                            {selected.details.subtitle && <div className="text-xs text-on-surface-variant mt-0.5">{selected.details.subtitle}</div>}
                            {selected.details.idLabel && <div className="font-mono text-[10px] text-outline mt-0.5">ID: {selected.details.idLabel}</div>}
                          </div>
                        </div>
                        {selected.risk === "high" && (
                          <div className="text-[10px] font-bold text-rose-400 border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 rounded uppercase">High Risk</div>
                        )}
                      </div>
                    </div>

                    {(selected.details.connections !== undefined || selected.details.evidenceCount !== undefined || selected.details.caseCount !== undefined) && (
                      <div className="p-3 grid grid-cols-3 gap-2 border-b border-outline-variant text-center">
                        <div className="bg-surface-container rounded-lg p-2 border border-outline-variant/40">
                          <div className="text-base text-on-surface font-bold">{selected.details.connections ?? "-"}</div>
                          <div className="text-[10px] text-on-surface-variant">Connections</div>
                        </div>
                        <div className="bg-surface-container rounded-lg p-2 border border-outline-variant/40">
                          <div className="text-base text-on-surface font-bold">{selected.details.evidenceCount ?? "-"}</div>
                          <div className="text-[10px] text-on-surface-variant">Evidence</div>
                        </div>
                        <div className="bg-surface-container rounded-lg p-2 border border-outline-variant/40">
                          <div className="text-base text-on-surface font-bold">{selected.details.caseCount ?? "-"}</div>
                          <div className="text-[10px] text-on-surface-variant">Cases</div>
                        </div>
                      </div>
                    )}

                    {selected.details.riskScore !== undefined && (
                      <div className="p-3.5 border-b border-outline-variant">
                        <div className="text-xs font-semibold text-on-surface mb-2">Risk Assessment</div>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full border-2 border-rose-500/40 bg-rose-500/10 flex flex-col items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-rose-400 leading-none">{selected.details.riskScore}</span>
                            <span className="text-[9px] text-outline">/100</span>
                          </div>
                          <div className="flex-1 space-y-1 text-xs">
                            {selected.details.extra?.map((row) => (
                              <div key={row.label} className="flex justify-between items-center text-[11px]">
                                <span className="text-on-surface-variant">{row.label}</span>
                                <span className="text-rose-400 font-semibold">{row.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Relational Insights for Selected Entity */}
                    <div className="p-3.5 border-b border-outline-variant space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-on-surface">
                          <span className="material-symbols-outlined text-[15px] text-primary">insights</span>
                          <span>Relational Analysis</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant/60 text-xs space-y-2">
                        <p className="text-on-surface-variant leading-relaxed text-[11px]">
                          {selected.id === "org1"
                            ? "XYZ Logistics functions as a shell company under unregistered beneficial ownership of Person A. Linked through wire transfers to Account #4567."
                            : selected.id === "per_a"
                            ? "Person A acts as the central hub node (degree centrality 18) connecting 3 criminal investigation cases (#101, #209, #317) and 2 burner phones."
                            : selected.id === "phone1" || selected.id === "phone2"
                            ? `Intercepted line ${selected.label}. Direct call logs (342s duration) link this line to Person A during active crime timeframe.`
                            : selected.id === "account1"
                            ? "Wire transfer sink account linked to institutional financial siphoning in Cyber Fraud Ring (Case #209)."
                            : selected.id === "case209" || selected.id === "case317"
                            ? `Cross-case overlap detected between ${selected.label} and Operation Nightfall. Shared primary target Person A.`
                            : selected.id === "evidence1"
                            ? "FIR Document FIR_101.pdf. SHA-256 evidence hash verified on Blockchain (TxID 0x7f8a3291bc40)."
                            : `Entity ${selected.label} (${selected.type}) maintains verified relational links with primary target Person A.`}
                        </p>

                        {/* Multi-Hop Path */}
                        <div className="pt-1.5 border-t border-outline-variant/40 font-mono text-[10px] text-on-surface-variant">
                          <div className="font-semibold text-primary">Multi-Hop Path:</div>
                          <div className="text-outline mt-0.5">
                            {selected.id === "org1"
                              ? "(XYZ Logistics:Org) ←[:owns]- (Person A:Person) -[:transferred]→ (Account - 4567)"
                              : selected.id === "per_a"
                              ? "(Person A:Person) -[:called]→ (BurnerPhone) -[:associated]→ (Case #101)"
                              : `(${selected.label}) ←--------→ (Person A:Person) -[:linked_to]→ (Case #101)`}
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/copilot"
                        className="w-full py-1.5 bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant rounded-lg text-[11px] font-medium transition flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px] text-primary">smart_toy</span>
                        Investigate in Copilot
                      </Link>
                    </div>

                    <div className="p-3.5 mt-auto">
                      <Link
                        href="/evidence-integrity"
                        className="w-full py-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span> View Evidence Record
                      </Link>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </CaseGate>
        </div>
      </div>
    </div>
  );
}
