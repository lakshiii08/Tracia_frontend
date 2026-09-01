"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppData } from "@/lib/store";

export default function AnalyticsPage() {
  const { entityQueue, totalEntityMatches, evidenceFiles, cases } = useAppData();
  const [notice, setNotice] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const resolved = totalEntityMatches - entityQueue.length;
  const indexedFiles = evidenceFiles.filter((f) => f.status === "Indexed").length;

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const runDeepAnalysis = () => {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      showNotice("Deep analysis complete — no new anomalies found in this demo dataset.");
    }, 1400);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      {notice && <div role="status" className="fixed right-5 top-5 z-50 rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm text-primary shadow-xl">{notice}</div>}

      <header className="bg-surface-container border-b border-outline-variant bg-surface-container/70 backdrop-blur-xl flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2 text-headline-md font-headline-md font-bold text-on-surface">
          <span className="material-symbols-outlined text-primary text-2xl">hub</span><span>TRACIA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors rounded px-2 py-1 font-label-mono text-label-mono flex items-center gap-1" href="/dashboard">
            <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
          </Link>
          <Link className="text-primary border-b-2 border-primary pb-1 font-label-mono text-label-mono flex items-center gap-1" href="/analytics">
            <span className="material-symbols-outlined text-[18px]">insights</span> Analytics
          </Link>
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors rounded px-2 py-1 font-label-mono text-label-mono flex items-center gap-1" href="/copilot">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span> Copilot
          </Link>
        </nav>
        <Link href="/profile" className="text-body-sm font-medium hover:text-primary transition-colors">Inspector A.</Link>
      </header>

      <main className="flex-1 p-gutter">
        <div className="flex justify-between items-end mb-gutter flex-wrap gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Graph Intelligence Analytics</h1>
            <div className="text-body-sm text-on-surface-variant mt-1">Cross-case entity resolution and anomaly detection</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => showNotice("Report export queued — will download once the backend is connected.")} className="bg-surface-container border border-outline-variant hover:bg-surface-variant transition-colors px-4 py-2 rounded-md text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span> Export Report
            </button>
            <button onClick={runDeepAnalysis} disabled={analyzing} className="bg-primary text-on-primary hover:bg-primary-container transition-colors px-4 py-2 rounded-md text-body-sm font-semibold flex items-center gap-2 disabled:opacity-60">
              <span className={`material-symbols-outlined text-[18px] ${analyzing ? "animate-spin" : ""}`}>{analyzing ? "progress_activity" : "science"}</span>
              {analyzing ? "Analyzing..." : "Run Deep Analysis"}
            </button>
          </div>
        </div>

        {/* Live session stats — proves the shared store works across pages */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-gutter">
          <div className="bg-surface-container-low border border-surface-bright rounded-xl p-4">
            <div className="text-[11px] text-on-surface-variant uppercase font-label-mono">Total Cases</div>
            <div className="text-headline-md font-headline-md text-on-surface mt-1">{cases.length}</div>
          </div>
          <div className="bg-surface-container-low border border-surface-bright rounded-xl p-4">
            <div className="text-[11px] text-on-surface-variant uppercase font-label-mono">Entities Resolved</div>
            <div className="text-headline-md font-headline-md text-entity-phone mt-1">{resolved} / {totalEntityMatches}</div>
          </div>
          <div className="bg-surface-container-low border border-surface-bright rounded-xl p-4">
            <div className="text-[11px] text-on-surface-variant uppercase font-label-mono">Evidence Indexed</div>
            <div className="text-headline-md font-headline-md text-primary mt-1">{indexedFiles} / {evidenceFiles.length}</div>
          </div>
          <div className="bg-surface-container-low border border-surface-bright rounded-xl p-4">
            <div className="text-[11px] text-on-surface-variant uppercase font-label-mono">Pending Matches</div>
            <div className="text-headline-md font-headline-md text-entity-vehicle mt-1">{entityQueue.length}</div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-gutter">
          <section className="col-span-12 xl:col-span-8 bg-surface-container-low border border-surface-bright rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-surface-bright flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-entity-organization">hub</span> Cross-Case Links
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-label-mono font-label-mono text-on-surface-variant border-b border-outline-variant">
                    <th className="pb-2 font-medium">Entity ID</th>
                    <th className="pb-2 font-medium">Associated Cases</th>
                    <th className="pb-2 font-medium">Connection Path</th>
                    <th className="pb-2 font-medium text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm font-body-sm">
                  <tr className="border-b border-surface-bright hover:bg-surface-container transition-colors">
                    <td className="py-3 font-code-sm text-code-sm text-entity-person flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">person</span> PER_10023</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-entity-organization/20 text-entity-organization text-label-mono font-label-mono border border-entity-organization/30">Case #101</span>
                        <span className="px-2 py-0.5 rounded-full bg-entity-organization/20 text-entity-organization text-label-mono font-label-mono border border-entity-organization/30">Case #209</span>
                      </div>
                    </td>
                    <td className="py-3 text-on-surface-variant">Phone &rarr; Bank Acct</td>
                    <td className="py-3 text-right text-entity-phone font-code-sm">94%</td>
                  </tr>
                  <tr className="hover:bg-surface-container transition-colors">
                    <td className="py-3 font-code-sm text-code-sm text-entity-location flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">location_on</span> LOC_8492</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-entity-organization/20 text-entity-organization text-label-mono font-label-mono border border-entity-organization/30">Case #317</span>
                      </div>
                    </td>
                    <td className="py-3 text-on-surface-variant">Address &rarr; Vehicle Reg</td>
                    <td className="py-3 text-right text-entity-phone font-code-sm">88%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="col-span-12 xl:col-span-4 bg-surface-container-low border border-surface-bright rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-surface-bright flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">group_work</span> Communities</h2>
            </div>
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto">
              <button onClick={() => showNotice("Financial Syndicate A cluster opened.")} className="bg-surface-container border border-surface-bright rounded-lg p-3 text-left hover:border-primary/50 transition-colors">
                <div className="h-20 w-full mb-2 rounded bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-outline/50 text-4xl">bubble_chart</span></div>
                <div className="text-body-sm font-semibold text-on-surface truncate">Financial Syndicate A</div>
                <div className="text-label-mono text-on-surface-variant mt-1">14 Entities</div>
              </button>
              <button onClick={() => showNotice("Narco Cell - Mumbai cluster opened.")} className="bg-surface-container border border-surface-bright rounded-lg p-3 text-left hover:border-primary/50 transition-colors">
                <div className="h-20 w-full mb-2 rounded bg-surface-container-highest flex items-center justify-center"><span className="material-symbols-outlined text-outline/50 text-4xl">share</span></div>
                <div className="text-body-sm font-semibold text-on-surface truncate">Narco Cell - Mumbai</div>
                <div className="text-label-mono text-on-surface-variant mt-1">22 Entities</div>
              </button>
            </div>
          </section>

          <section className="col-span-12 xl:col-span-6 bg-surface-container-low border border-surface-bright rounded-xl overflow-hidden flex flex-col h-[350px]">
            <div className="p-4 border-b border-surface-bright flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-entity-vehicle">timeline</span> Bridge Nodes</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-surface-bright border-l-4 border-l-entity-person">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-entity-person/20 text-entity-person flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">person</span></div>
                    <div><div className="text-body-sm font-semibold text-on-surface">Person A (PER_10023)</div><div className="text-label-mono font-label-mono text-on-surface-variant">Connects 3 Clusters</div></div>
                  </div>
                  <div className="text-right"><div className="font-code-sm text-entity-risk font-bold">0.89</div><div className="text-[10px] text-on-surface-variant uppercase">Centrality</div></div>
                </li>
              </ul>
            </div>
          </section>

          <section className="col-span-12 xl:col-span-6 bg-surface-container-low border border-surface-bright rounded-xl overflow-hidden flex flex-col h-[350px]">
            <div className="p-4 border-b border-surface-bright flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-entity-risk">warning</span> Anomalies &amp; Contradictions</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-entity-risk/20 text-entity-risk border border-entity-risk/30">3 NEW</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="p-4 bg-surface-container rounded-lg border border-entity-risk/30 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-entity-risk" />
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-entity-risk text-white">HIGH</span><span className="text-body-sm font-semibold text-on-surface">Timeline Contradiction</span></div>
                  <span className="text-label-mono font-label-mono text-on-surface-variant">10 May 2025</span>
                </div>
                <p className="text-body-sm text-on-surface-variant mb-3">Person A&apos;s CDR indicates location in Delhi, while ATM withdrawal record shows simultaneous activity in Mumbai.</p>
                <div className="flex justify-end">
                  <Link href="/graph" className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1">Investigate <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-8 pt-4 border-t border-outline-variant flex justify-between items-center text-label-mono font-label-mono text-on-surface-variant flex-wrap gap-2">
          <div className="flex items-center gap-4"><div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-primary">key</span> SESSION ID: <span className="font-code-sm text-on-surface">TRC-8924-X</span></div></div>
          <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">cloud_done</span> AUTO-SAVE ON</div>
        </footer>
      </main>
    </div>
  );
}
