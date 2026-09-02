"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CaseGate from "@/components/CaseGate";
import { useAppData } from "@/lib/store";

export default function EvidenceIntegrityPage() {
  const { evidenceFiles, addEvidenceFiles, blockchainRecords } = useAppData();
  const [activeTab, setActiveTab] = useState<"integrity" | "blockchain">("blockchain");
  const [newFile, setNewFile] = useState("");
  const [fileType, setFileType] = useState("FIR");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile.trim()) return;
    addEvidenceFiles([{ filename: newFile.trim(), type: fileType }]);
    setNewFile("");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar title="TRACIA · Blockchain Evidence Integrity & Custody" showSearch />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <CaseGate moduleTitle="Blockchain Evidence Integrity & Chain of Custody">
            <div className="p-5 lg:p-8">
              <div className="mx-auto max-w-7xl space-y-6">
                {/* Header banner */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-label-mono text-xs text-primary">TRUST &amp; SECURITY LAYER</div>
                    <h1 className="text-3xl font-bold">Blockchain Evidence Integrity &amp; Chain of Custody</h1>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Cryptographic SHA-256 evidence hashing, permissioned blockchain transaction verification, and immutable chain of custody audit trails.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                      BLOCKCHAIN INTEGRITY ACTIVE
                    </span>
                  </div>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-2 border-b border-outline-variant pb-1">
                  <button
                    onClick={() => setActiveTab("blockchain")}
                    className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition ${
                      activeTab === "blockchain"
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Blockchain Chain of Custody (Sections 22–24)
                  </button>
                  <button
                    onClick={() => setActiveTab("integrity")}
                    className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition ${
                      activeTab === "integrity"
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Evidence Upload &amp; OCR Ingestion
                  </button>
                </div>

                {/* TAB: Blockchain Chain of Custody */}
                {activeTab === "blockchain" && (
                  <div className="space-y-6">
                    {/* Graph Schema Diagram (Section 23 Blueprint) */}
                    <section className="rounded-xl border border-outline-variant bg-surface-container p-5">
                      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant font-label-mono">
                        Blockchain + Neo4j Relationship Schema (Section 23 Blueprint)
                      </h2>
                      <div className="flex flex-wrap items-center justify-center gap-4 py-3 font-mono text-xs text-center">
                        <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 p-3">
                          <div className="font-bold text-blue-400">(:Evidence)</div>
                          <div className="text-[10px] text-outline">incident_report_01.pdf</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-emerald-400">VERIFIED_BY</span>
                          <span className="material-symbols-outlined text-primary">arrow_forward</span>
                        </div>
                        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
                          <div className="font-bold text-emerald-400">(:BlockchainRecord)</div>
                          <div className="text-[10px] text-outline">0x7f8a3291bc40...</div>
                        </div>
                      </div>
                    </section>

                    {/* Chain of Custody Pipeline Card */}
                    <section className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                      <h3 className="font-semibold text-sm">Chain of Custody Handover Log (Section 24 Blueprint)</h3>
                      <div className="grid gap-3 sm:grid-cols-5 text-center font-mono text-xs">
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                          <div className="font-bold text-primary">Step 1</div>
                          <div className="text-on-surface font-semibold mt-1">Evidence Collected</div>
                          <div className="text-[10px] text-outline mt-1">Officer A</div>
                        </div>
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                          <div className="font-bold text-primary">Step 2</div>
                          <div className="text-on-surface font-semibold mt-1">Transferred</div>
                          <div className="text-[10px] text-outline mt-1">Secure Vault</div>
                        </div>
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                          <div className="font-bold text-primary">Step 3</div>
                          <div className="text-on-surface font-semibold mt-1">Forensic Expert</div>
                          <div className="text-[10px] text-outline mt-1">Expert B</div>
                        </div>
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                          <div className="font-bold text-primary">Step 4</div>
                          <div className="text-on-surface font-semibold mt-1">Analysis</div>
                          <div className="text-[10px] text-outline mt-1">SHA-256 Generated</div>
                        </div>
                        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
                          <div className="font-bold text-primary">Step 5</div>
                          <div className="text-on-surface font-semibold mt-1">Court Submission</div>
                          <div className="text-[10px] text-outline mt-1">Verified Legal Record</div>
                        </div>
                      </div>
                    </section>

                    {/* Blockchain Records List */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm">Verified Blockchain Proof Records</h3>
                      {blockchainRecords.map((b) => (
                        <div key={b.evidenceId} className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-3">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                              <div className="font-bold text-base text-on-surface">{b.filename}</div>
                              <div className="font-mono text-xs text-primary">Evidence ID: {b.evidenceId}</div>
                            </div>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 font-mono">
                              STATUS: {b.verifiedStatus}
                            </span>
                          </div>

                          <div className="rounded-lg bg-surface-container-low p-3 font-mono text-xs space-y-1">
                            <div><span className="text-outline">SHA-256 Hash:</span> <span className="text-amber-400">{b.sha256Hash}</span></div>
                            <div><span className="text-outline">Blockchain TxID:</span> <span className="text-emerald-400">{b.txId}</span></div>
                            <div><span className="text-outline">Custodian:</span> <span className="text-on-surface">{b.custodian}</span></div>
                          </div>

                          <div className="space-y-1.5 text-xs pt-2">
                            <div className="font-bold text-outline uppercase tracking-wider text-[10px] font-label-mono">Audit History Trail:</div>
                            {b.history.map((h, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-on-surface-variant font-mono">
                                <span className="text-primary text-[11px]">{h.timestamp}</span>
                                <span>{h.step}</span>
                                <span className="text-outline">({h.actor})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB: Evidence Ingestion & Upload */}
                {activeTab === "integrity" && (
                  <div className="space-y-6">
                    {/* Upload Form */}
                    <form onSubmit={handleUpload} className="rounded-xl border border-outline-variant bg-surface-container p-5 space-y-4">
                      <h3 className="font-semibold text-sm">Upload New Investigation Evidence</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <label className="text-xs text-outline">Filename</label>
                          <input
                            type="text"
                            value={newFile}
                            onChange={(e) => setNewFile(e.target.value)}
                            placeholder="e.g. mobile_extraction_call_log.csv"
                            className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-outline">Evidence Type</label>
                          <select
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs outline-none focus:border-primary"
                          >
                            <option>FIR</option>
                            <option>CDR</option>
                            <option>FINANCIAL</option>
                            <option>FORENSIC</option>
                            <option>CCTV</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary">
                          Upload &amp; Generate SHA-256 Proof
                        </button>
                      </div>
                    </form>

                    {/* Evidence Files List */}
                    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
                      <div className="border-b border-outline-variant bg-surface-container-high p-4">
                        <h3 className="font-semibold text-sm">Ingested Evidence Files &amp; Pipeline Status</h3>
                      </div>
                      <div className="divide-y divide-outline-variant/50 text-xs">
                        {evidenceFiles.map((f) => (
                          <div key={f.id} className="p-4 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-on-surface">{f.filename}</div>
                              <div className="text-outline text-[11px]">Type: {f.type}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded bg-primary/10 border border-primary/30 px-2 py-1 text-primary font-mono text-[11px]">
                                {f.status} ({f.progress}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CaseGate>
        </main>
      </div>
    </div>
  );
}
