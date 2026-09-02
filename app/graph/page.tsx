"use client";

import { useState } from "react";
import { useAppData } from "@/lib/store";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CaseGate from "@/components/CaseGate";
import RelationshipGraph from "@/components/RelationshipGraph";
import { entityColors, type GraphNode } from "@/lib/graphData";

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
  const {
    graphNodes,
    graphEdges,
    resolvedEntities,
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
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  const handleCypherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cypherInput.trim()) {
      runCypherQuery(cypherInput.trim());
    }
  };

  const presets = [
    { label: "All Entities", cypher: "MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 100" },
    { label: "High Risk Targets", cypher: "MATCH (n:Entity {risk: 'high'}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m" },
    { label: "Phone Networks", cypher: "MATCH (n:Entity {type: 'phone'}) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m" },
  ];

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

  return (
    <div className="bg-background text-on-background font-body-sm min-h-screen flex flex-col overflow-hidden">
      <Navbar title="TRACIA · Knowledge Graph Module" showSearch />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CaseGate moduleTitle="Knowledge Graph & Entity Relations">
          <div className="flex-1 flex overflow-hidden min-h-0 h-full">
        {/* Left sidebar */}
        <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-outline-variant">
            <h3 className="text-label-mono font-label-mono font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Data Sources</h3>
            <div className="space-y-1 text-body-sm text-on-surface-variant">
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">description</span>FIR / Documents</span>
                <span className="font-code-sm text-code-sm">128</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">call</span>CDR Records</span>
                <span className="font-code-sm text-code-sm">2,341</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">account_balance</span>Financial Records</span>
                <span className="font-code-sm text-code-sm">842</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">location_on</span>Location Data</span>
                <span className="font-code-sm text-code-sm">1,256</span>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            <h3 className="text-label-mono font-label-mono font-bold text-on-surface-variant uppercase tracking-wider mb-3">Cases</h3>
            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              <Link href="/case/nightfall" className="block bg-primary-container/20 border-l-2 border-primary p-2 rounded-r-md cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">folder_shared</span>
                    <div>
                      <div className="text-body-sm font-semibold text-primary">Case #101</div>
                      <div className="text-[12px] text-on-surface-variant">Kidnapping & Extortion</div>
                    </div>
                  </div>
                  <span className="font-code-sm text-[11px] text-on-surface-variant">10 May 2025</span>
                </div>
              </Link>
              <div className="p-2 rounded-md hover:bg-surface-variant cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5">description</span>
                    <div>
                      <div className="text-body-sm text-on-surface">Case #209</div>
                      <div className="text-[12px] text-on-surface-variant">Cyber Fraud</div>
                    </div>
                  </div>
                  <span className="font-code-sm text-[11px] text-on-surface-variant">22 Apr 2025</span>
                </div>
              </div>
            </div>

            {/* AI Copilot & Relation Link Key Insights Section */}
            <div className="mt-4 p-3 bg-surface-container rounded-lg border border-primary/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                  <span className="material-symbols-outlined text-[16px] animate-pulse">smart_toy</span>
                  <span>AI Copilot Graph Insights</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-[9px] font-mono font-bold text-primary">
                  GraphRAG
                </span>
              </div>

              {/* Key Relation Link Insights */}
              <div className="space-y-1.5 text-xs">
                <div className="text-[10px] font-label-mono font-bold uppercase text-outline">Key Relation Insights:</div>
                
                <button
                  onClick={() => {
                    const node = graphNodes.find(n => n.id === "org1") || null;
                    handleSelectNode(node);
                  }}
                  className="w-full text-left p-2 rounded bg-surface-container-low hover:bg-surface-variant border border-outline-variant/60 transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface group-hover:text-primary transition">Person A ↔ XYZ Logistics</span>
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
                    <span className="font-bold text-on-surface group-hover:text-primary transition">Person A ↔ +91 9123456780</span>
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
                    <span className="font-bold text-on-surface group-hover:text-primary transition">Person A ↔ Case #209</span>
                    <span className="text-[9px] font-mono text-purple-400 font-bold bg-purple-500/10 px-1 rounded">Cross-Case</span>
                  </div>
                  <div className="text-[10px] text-outline mt-0.5">Cyber Fraud overlap via Account - 4567</div>
                </button>
              </div>

              {/* Copilot Questioning Form */}
              <div className="pt-2 border-t border-outline-variant/50 space-y-2">
                <div className="text-[10px] font-label-mono font-bold uppercase text-outline">Ask AI Copilot:</div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!copilotQuery.trim()) return;
                    setIsCopilotThinking(true);
                    setTimeout(() => {
                      setCopilotAnswer(`GraphRAG Analysis for "${copilotQuery}": Person A is the central hub node (degree centrality 18). Multi-hop path confirms direct linkage to 3 high-risk entities across Cases #101 and #209.`);
                      setIsCopilotThinking(false);
                    }, 400);
                  }}
                  className="space-y-1.5"
                >
                  <input
                    type="text"
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    placeholder="Question relationship links..."
                    className="w-full rounded bg-surface-container-high border border-outline-variant py-1 px-2 text-[11px] text-on-surface focus:outline-none focus:border-primary font-mono"
                  />
                  <div className="flex gap-1 flex-wrap text-[9px]">
                    <button
                      type="button"
                      onClick={() => {
                        const node = graphNodes.find(n => n.id === "org1") || null;
                        handleSelectNode(node);
                      }}
                      className="px-1.5 py-0.5 rounded bg-surface-variant hover:bg-surface-container-high text-on-surface-variant border border-outline-variant"
                    >
                      Why XYZ Logistics?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const node = graphNodes.find(n => n.id === "account1") || null;
                        handleSelectNode(node);
                      }}
                      className="px-1.5 py-0.5 rounded bg-surface-variant hover:bg-surface-container-high text-on-surface-variant border border-outline-variant"
                    >
                      Path to Account?
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={isCopilotThinking}
                    className="w-full py-1 bg-primary hover:bg-primary/90 text-on-primary rounded text-[11px] font-semibold transition flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                    {isCopilotThinking ? "Analyzing Graph..." : "Ask Copilot"}
                  </button>
                </form>

                {/* Copilot Answer Display */}
                {copilotAnswer && (
                  <div className="p-2 rounded bg-surface-container-high border border-primary/40 text-[10px] space-y-1 text-on-surface animate-fadeIn">
                    <div className="font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                      Copilot Insights:
                    </div>
                    <p className="leading-tight text-on-surface-variant">{copilotAnswer}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Neo4j Database Status & Seed Card */}
            <div className="mt-4 p-3 bg-surface-container rounded-lg border border-outline-variant space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${neo4jConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className="text-xs font-semibold text-on-surface">
                    {neo4jConnected ? "Neo4j Database Connected" : "Local Graph Fallback"}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {neo4jConnected
                  ? "Connected via Bolt protocol to Neo4j graph cluster."
                  : "Neo4j service offline. Using local TRACIA graph engine."}
              </p>
              <button
                onClick={seedNeo4j}
                disabled={isNeo4jLoading}
                className="w-full mt-1 py-1.5 px-3 bg-surface-container-high hover:bg-surface-variant text-primary border border-primary/30 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">database</span>
                {isNeo4jLoading ? "Processing..." : "Seed Neo4j Database"}
              </button>
            </div>

            <div className="mt-4 p-3 bg-surface-variant rounded-lg flex items-center justify-between">
              <div>
                <div className="text-label-mono font-label-mono text-on-surface-variant">Cross-Case Links</div>
                <div className="text-headline-md font-headline-md font-bold text-primary">17 <span className="text-body-sm font-normal text-on-surface-variant">Connections</span></div>
              </div>
              <Link href="/analytics" className="text-primary text-[12px] hover:underline">View All</Link>
            </div>
          </div>
        </aside>

        {/* Center graph */}
        <main className="flex-1 flex flex-col bg-surface relative overflow-hidden">
          {/* Header & Controls */}
          <div className="p-4 z-10 bg-surface/80 backdrop-blur-sm border-b border-outline-variant space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-headline-md font-headline-md font-bold text-on-surface">RELATIONSHIP GRAPH</h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${neo4jConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                    {neo4jConnected ? "Neo4j Cypher Engine" : "TRACIA Graph Store"}
                  </span>
                </div>
                <div className="text-body-sm text-on-surface-variant">
                  {graphNodes.length} Entities | {graphEdges.length} Relationships &mdash; {resolvedEntities.length} merged live
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-surface-container-high rounded-md p-1 border border-outline-variant">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary-container/20 text-primary text-body-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">hub</span> Graph View
                  </button>
                </div>
              </div>
            </div>

            {/* Cypher Query Console */}
            <form onSubmit={handleCypherSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="font-mono text-xs text-primary absolute left-3 top-1/2 -translate-y-1/2 font-bold">CYPHER &gt;</span>
                <input
                  type="text"
                  value={cypherInput}
                  onChange={(e) => setCypherInput(e.target.value)}
                  placeholder="MATCH (n)-[r]->(m) RETURN n, r, m"
                  className="w-full bg-surface-container-high border border-outline-variant rounded-md py-1.5 pl-20 pr-4 text-xs font-mono text-on-surface focus:outline-none focus:border-primary transition"
                />
              </div>
              <button
                type="submit"
                disabled={isNeo4jLoading}
                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-md text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                {isNeo4jLoading ? "Executing..." : "Run Query"}
              </button>
            </form>

            {/* Preset Cypher Shortcuts & Legend */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant font-label-mono text-[11px] uppercase">Presets:</span>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setCypherInput(p.cypher);
                      runCypherQuery(p.cypher);
                    }}
                    className="px-2 py-0.5 bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-on-surface rounded text-[11px] font-mono transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 text-label-mono font-label-mono">
                {legendItems.map((item) => (
                  <div key={item.type} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entityColors[item.type] }} />
                    <span className="text-[11px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Notification */}
            {neo4jError && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded text-xs flex items-center justify-between">
                <span className="font-mono">{neo4jError}</span>
                <button onClick={() => runCypherQuery(currentCypher)} className="text-[11px] underline ml-2">Retry</button>
              </div>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden">
            <RelationshipGraph nodes={graphNodes} edges={graphEdges} onSelectNode={handleSelectNode} />

            {/* Floating Bottom-Left AI Key Insights Overlay on Graph Canvas */}
            <div className="absolute bottom-4 left-4 max-w-sm z-30 p-3.5 rounded-xl bg-surface-container/95 border border-primary/40 backdrop-blur-md shadow-2xl space-y-2 text-xs pointer-events-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                  <span className="material-symbols-outlined text-[16px] animate-pulse">smart_toy</span>
                  <span>AI Copilot Relation Insights</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-[9px] font-mono font-bold text-primary">
                  GraphRAG Live
                </span>
              </div>

              {selected ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between border-b border-outline-variant/40 pb-1">
                    <span className="font-bold text-on-surface">{selected.label}</span>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase">{selected.type}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-tight">
                    {copilotAnswer || `GraphRAG Analysis: Entity ${selected.label} maintains active relationship connections in the graph.`}
                  </p>
                  <div className="pt-1 font-mono text-[10px] text-outline">
                    <span className="text-primary font-bold">Multi-Hop Path: </span>
                    {selected.id === "org1"
                      ? "(XYZ Logistics:Org) <-[:owns]- (Person A) -[:transferred]-> (Account - 4567)"
                      : selected.id === "per_a"
                      ? "(Person A:Person) -[:called]-> (BurnerPhone) -[:associated]-> (Case #101)"
                      : `(${selected.label}) <--------> (Person A:Person) -[:linked_to]-> (Case #101)`}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-on-surface-variant">
                  Click any node on the graph to see instant AI Copilot insights and multi-hop paths right here in the left corner.
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right entity details panel — dynamic based on selection */}
        <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col shrink-0 overflow-y-auto z-20">
          <div className="flex items-center justify-between p-4 border-b border-outline-variant">
            <h3 className="text-label-mono font-label-mono font-bold text-on-surface uppercase tracking-wider">Entity Details</h3>
          </div>
          {!selected ? (
            <div className="p-6 text-body-sm text-on-surface-variant">
              Click any node in the graph to see its details here.
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-outline-variant">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: entityColors[selected.type] }}
                    >
                      <span className="material-symbols-outlined" style={{ color: entityColors[selected.type] }}>
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
                    <div>
                      <h2 className="text-headline-md font-headline-md font-bold text-on-surface leading-tight">{selected.label}</h2>
                      {selected.details.subtitle && <div className="text-body-sm text-on-surface-variant">{selected.details.subtitle}</div>}
                      {selected.details.idLabel && <div className="font-code-sm text-code-sm text-on-surface-variant mt-1">ID: {selected.details.idLabel}</div>}
                    </div>
                  </div>
                  {selected.risk === "high" && (
                    <div className="text-[11px] font-bold text-entity-risk border border-entity-risk/30 bg-entity-risk/10 px-2 py-0.5 rounded uppercase tracking-wider">High Risk</div>
                  )}
                </div>
              </div>

              {(selected.details.connections !== undefined || selected.details.evidenceCount !== undefined || selected.details.caseCount !== undefined) && (
                <div className="p-4 grid grid-cols-3 gap-2 border-b border-outline-variant">
                  <div className="bg-surface-variant rounded flex flex-col items-center justify-center p-2">
                    <div className="text-headline-md text-on-surface font-bold">{selected.details.connections ?? "-"}</div>
                    <div className="text-[11px] text-on-surface-variant text-center">Connections</div>
                  </div>
                  <div className="bg-surface-variant rounded flex flex-col items-center justify-center p-2">
                    <div className="text-headline-md text-on-surface font-bold">{selected.details.evidenceCount ?? "-"}</div>
                    <div className="text-[11px] text-on-surface-variant text-center">Evidence</div>
                  </div>
                  <div className="bg-surface-variant rounded flex flex-col items-center justify-center p-2">
                    <div className="text-headline-md text-on-surface font-bold">{selected.details.caseCount ?? "-"}</div>
                    <div className="text-[11px] text-on-surface-variant text-center">Cases</div>
                  </div>
                </div>
              )}

              {selected.details.riskScore !== undefined && (
                <div className="p-4 border-b border-outline-variant">
                  <h4 className="text-label-mono font-label-mono font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Risk Score</h4>
                  <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-headline-md font-bold text-on-surface leading-none">{selected.details.riskScore}</span>
                        <span className="text-[10px] text-on-surface-variant">/100</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-body-sm">
                      {selected.details.extra?.map((row) => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-on-surface-variant text-[13px]">{row.label}</span>
                          <span className="text-entity-risk font-medium">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* AI Key Insights for Selected Entity */}
              <div className="p-4 border-b border-outline-variant space-y-2 bg-surface-container/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">smart_toy</span>
                    <span>AI Key Insights</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-[9px] font-mono font-bold text-primary">
                    GraphRAG Reasoning
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-high border border-primary/30 text-xs space-y-1.5">
                  <p className="text-on-surface leading-relaxed text-[11px]">
                    {selected.id === "org1"
                      ? "GraphRAG Analysis: XYZ Logistics functions as a shell company under unregistered beneficial ownership of Person A. Linked through wire transfers to Account - 4567."
                      : selected.id === "per_a"
                      ? "GraphRAG Analysis: Person A acts as the central hub node (degree centrality 18) connecting 3 criminal investigation cases (#101, #209, #317) and 2 burner phones."
                      : selected.id === "phone1" || selected.id === "phone2"
                      ? `GraphRAG Analysis: Intercepted phone node ${selected.label}. Direct call logs (342s duration) link this line to Person A during active crime timeframe.`
                      : selected.id === "account1"
                      ? "GraphRAG Analysis: Wire transfer sink account linked to institutional financial siphoning in Cyber Fraud Ring (Case #209)."
                      : selected.id === "case209" || selected.id === "case317"
                      ? `GraphRAG Analysis: Cross-case overlap detected between ${selected.label} and Operation Nightfall. Shared primary target Person A.`
                      : selected.id === "evidence1"
                      ? "GraphRAG Analysis: FIR Document FIR_101.pdf. SHA-256 evidence hash verified on Blockchain (TxID 0x7f8a3291bc40)."
                      : `GraphRAG Analysis: Entity ${selected.label} (${selected.type}) maintains verified relational links with primary target Person A.`}
                  </p>

                  {/* Multi-Hop Path Badge */}
                  <div className="pt-1 border-t border-outline-variant/40 font-mono text-[10px] text-on-surface-variant">
                    <div className="font-bold text-primary">Multi-Hop Path:</div>
                    <div className="text-outline">
                      {selected.id === "org1"
                        ? "(XYZ Logistics:Org) <-[:owns]- (Person A:Person) -[:transferred]-> (Account - 4567)"
                        : selected.id === "per_a"
                        ? "(Person A:Person) -[:called]-> (BurnerPhone) -[:associated]-> (Case #101)"
                        : `(${selected.label}) <--------> (Person A:Person) -[:linked_to]-> (Case #101)`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCopilotQuery(`Explain all key relationship links for entity ${selected.label}`);
                    setCopilotAnswer(`GraphRAG Deep Analysis for ${selected.label} (${selected.type}): Connected to Person A via ${selected.id === "org1" ? "ownership & financial transfers" : selected.id === "phone1" ? "direct call intercepts" : "cross-case investigation links"}. Integrity verified against evidence log.`);
                  }}
                  className="w-full py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded text-[11px] font-semibold transition flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">psychology</span>
                  Ask Copilot About {selected.label}
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-2">
                <Link
                  href="/evidence-integrity"
                  className="w-full py-2 bg-entity-organization hover:bg-entity-organization/90 text-white rounded-md text-body-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span> Verify Evidence
                </Link>
                <Link
                  href="/copilot"
                  className="w-full py-2 bg-surface-container-high hover:bg-surface-variant text-primary border border-primary/40 rounded-md text-body-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span> Full Copilot Analysis
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </CaseGate>
  </div>
</div>
  );
}
