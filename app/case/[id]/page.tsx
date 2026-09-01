"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAppData, type CaseStatus } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function CaseWorkspacePage() {
  const params = useParams<{ id: string }>();
  const { cases, evidenceFiles, auditTrail, graphNodes, graphEdges, updateCase, cdrRecords, timelineEvents, blockchainRecords, cyberEvents } = useAppData();
  
  const caseIdInput = (params.id || "TR-102").toUpperCase();
  const currentCase = cases.find(c => c.id.toUpperCase() === caseIdInput) || cases[0];

  const [activeTab, setActiveTab] = useState<
    "overview" | "persons" | "evidence" | "cdr" | "timeline" | "graph" | "ai" | "custody" | "cyber"
  >("overview");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentCase.name);
  const [desc, setDesc] = useState(currentCase.desc);
  const [status, setStatus] = useState<CaseStatus>(currentCase.status);

  const save = () => {
    updateCase(currentCase.id, { name, desc, status });
    setEditing(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "persons", label: "Persons & Entities", icon: "group" },
    { id: "evidence", label: "Evidence", icon: "folder" },
    { id: "cdr", label: "CDR Analysis", icon: "call" },
    { id: "timeline", label: "Timeline", icon: "timeline" },
    { id: "graph", label: "Knowledge Graph", icon: "hub" },
    { id: "ai", label: "AI Insights", icon: "smart_toy" },
    { id: "custody", label: "Chain of Custody", icon: "verified" },
    { id: "cyber", label: "Cyber Intel", icon: "security" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar title={`Case Workspace · ${currentCase.id}`} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header Banner (Section 5 Blueprint) */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="mb-1 font-label-mono text-xs font-bold text-primary">
                  CASE #{currentCase.id} · CONTROLLED INVESTIGATION WORKSPACE
                </div>
                <h1 className="text-3xl font-bold">{currentCase.name}</h1>
                <p className="mt-1 max-w-3xl text-sm text-on-surface-variant">{currentCase.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {currentCase.status}
                </span>
                <button
                  onClick={() => setEditing(!editing)}
                  className="rounded-lg border border-outline-variant px-3.5 py-1.5 text-xs font-semibold hover:border-primary/50"
                >
                  <span className="material-symbols-outlined mr-1 align-middle text-[16px]">edit</span>
                  Edit Case
                </button>
              </div>
            </div>

            {/* Edit Case Drawer */}
            {editing && (
              <section className="rounded-xl border border-primary/30 bg-surface-container p-5 space-y-4">
                <h2 className="text-base font-semibold">Edit Case Details</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs text-outline">Case Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-xs text-outline">Status</label>
                    <select value={status} onChange={e=>setStatus(e.target.value as CaseStatus)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs">
                      <option>Active</option>
                      <option>Under Review</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="text-xs text-outline">Description</label>
                    <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={()=>setEditing(false)} className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs">Cancel</button>
                  <button onClick={save} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary">Save Changes</button>
                </div>
              </section>
            )}

            {/* Tabbed Navigation Bar (Section 5 Blueprint) */}
            <div className="flex items-center gap-1 border-b border-outline-variant overflow-x-auto pb-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold transition border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                  [{tab.label}]
                </button>
              ))}
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
                    <div className="text-xs text-outline">Entities Mapped</div>
                    <div className="mt-1 text-2xl font-bold">{graphNodes.length}</div>
                  </div>
                  <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
                    <div className="text-xs text-outline">Relationships</div>
                    <div className="mt-1 text-2xl font-bold">{graphEdges.length}</div>
                  </div>
                  <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
                    <div className="text-xs text-outline">Evidence Files</div>
                    <div className="mt-1 text-2xl font-bold">{evidenceFiles.length}</div>
                  </div>
                  <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
                    <div className="text-xs text-outline">Blockchain Proofs</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-400">{blockchainRecords.length} Verified</div>
                  </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-xl border border-outline-variant bg-surface-container p-5 lg:col-span-2 space-y-3">
                    <h3 className="font-semibold text-sm">Primary Targets &amp; Persons</h3>
                    <div className="divide-y divide-outline-variant/40 text-xs">
                      {graphNodes.slice(0, 4).map(node => (
                        <div key={node.id} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {node.label[0]}
                            </div>
                            <div>
                              <div className="font-bold text-on-surface">{node.label}</div>
                              <div className="text-outline text-[11px]">{node.details.subtitle || node.id}</div>
                            </div>
                          </div>
                          {node.risk === "high" && (
                            <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">HIGH RISK TARGET</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-3">
                    <h3 className="font-semibold text-sm">Recent Audit Log</h3>
                    <div className="space-y-3 text-xs">
                      {auditTrail.slice(0, 4).map(a => (
                        <div key={a.id} className="border-l-2 border-primary pl-2.5">
                          <div className="font-mono text-[10px] text-primary">{a.time}</div>
                          <div className="mt-0.5 text-on-surface-variant">{a.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Persons */}
            {activeTab === "persons" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h3 className="font-semibold text-sm">Case Persons &amp; Entity Roster</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {graphNodes.map(n => (
                    <div key={n.id} className="rounded-lg border border-outline-variant/70 bg-surface-container-low p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-primary">{n.label}</span>
                        <span className="rounded bg-surface-variant px-2 py-0.5 text-[10px] uppercase font-mono">{n.type}</span>
                      </div>
                      <p className="text-xs text-outline">{n.details.subtitle || "No subtitle provided"}</p>
                      <div className="text-[11px] font-mono text-outline">ID: {n.details.idLabel || n.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Evidence */}
            {activeTab === "evidence" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h3 className="font-semibold text-sm">Evidence Repository</h3>
                <div className="divide-y divide-outline-variant/40 text-xs">
                  {evidenceFiles.map(e => (
                    <div key={e.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-on-surface">{e.filename}</div>
                        <div className="text-outline text-[11px]">Type: {e.type}</div>
                      </div>
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-emerald-400 font-mono text-[11px]">
                        {e.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CDR Analysis */}
            {activeTab === "cdr" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">In-Case CDR Communication Log</h3>
                  <Link href="/cdr" className="text-xs text-primary underline">Open Full CDR Module →</Link>
                </div>
                <div className="space-y-2 text-xs">
                  {cdrRecords.map(r => (
                    <div key={r.id} className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary">{r.caller} ({r.callerName})</span>
                        <span className="mx-2 text-outline">➔</span>
                        <span className="font-bold text-emerald-400">{r.receiver} ({r.receiverName})</span>
                      </div>
                      <div className="font-mono text-outline text-[11px]">{r.durationSec}s · {r.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Timeline */}
            {activeTab === "timeline" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Chronological Event Timeline</h3>
                  <Link href="/timeline" className="text-xs text-primary underline">Open Interactive Timeline →</Link>
                </div>
                <div className="space-y-3 text-xs border-l-2 border-primary/40 pl-4">
                  {timelineEvents.map(evt => (
                    <div key={evt.id} className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-primary font-bold">{evt.time}</span>
                        <span className="text-outline">· {evt.category}</span>
                      </div>
                      <div className="font-bold text-on-surface">{evt.title}</div>
                      <div className="text-outline text-[11px]">{evt.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Knowledge Graph */}
            {activeTab === "graph" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4 text-center">
                <h3 className="font-semibold text-sm text-left">Case Neo4j Knowledge Graph</h3>
                <p className="text-xs text-outline text-left">Interactive graph visualization of multi-hop relationships for {currentCase.id}.</p>
                <Link href="/graph" className="inline-block rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary">
                  Open Interactive Neo4j Graph View →
                </Link>
              </div>
            )}

            {/* TAB CONTENT: AI Insights */}
            {activeTab === "ai" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h3 className="font-semibold text-sm">GraphRAG AI Insights &amp; Findings</h3>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-xs space-y-2">
                  <div className="font-bold text-primary">GraphRAG Summary:</div>
                  <p className="text-on-surface">
                    Operation Nightfall involves a multi-layered extortion network. Entity Vikram Sharma (+91 9876543210) bridges communications between burner phone Person A and suspect Rahul Sharma. High risk financial transfers have been traced to Account #4567.
                  </p>
                </div>
                <Link href="/copilot" className="inline-block text-xs text-primary underline">Query AI Copilot for deep reasoning →</Link>
              </div>
            )}

            {/* TAB CONTENT: Chain of Custody */}
            {activeTab === "custody" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h3 className="font-semibold text-sm">Blockchain Verified Chain of Custody</h3>
                <div className="space-y-3 text-xs">
                  {blockchainRecords.map(b => (
                    <div key={b.evidenceId} className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-on-surface">{b.filename} ({b.evidenceId})</div>
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 font-bold font-mono">
                          {b.verifiedStatus}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-outline">SHA-256: {b.sha256Hash}</div>
                      <div className="font-mono text-[11px] text-primary">TxID: {b.txId}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Cyber Intelligence */}
            {activeTab === "cyber" && (
              <div className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                <h3 className="font-semibold text-sm">Associated Cyber Intelligence</h3>
                <div className="divide-y divide-outline-variant/40 text-xs">
                  {cyberEvents.map(c => (
                    <div key={c.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-amber-400 font-mono">{c.ipAddress} ({c.deviceId})</div>
                        <div className="text-outline text-[11px]">Suspect: {c.suspect} · {c.eventType}</div>
                      </div>
                      <span className="font-bold text-rose-400 font-mono">Risk: {c.riskScore}/100</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
