"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CaseGate from "@/components/CaseGate";
import { useAppData } from "@/lib/store";

export default function CyberIntelPage() {
  const { cyberEvents } = useAppData();

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Navbar title="TRACIA · Cybercrime Intelligence Module" showSearch />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <CaseGate moduleTitle="Cybercrime Intelligence & Digital Indicators">
            <div className="p-5 lg:p-8">
              <div className="mx-auto max-w-7xl space-y-6">
                {/* Header banner */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-label-mono text-xs text-primary">CYBER THREAT MONITORING LAYER</div>
                    <h1 className="text-3xl font-bold">Cybercrime Intelligence</h1>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Correlate authorized digital indicators (IP addresses, MAC addresses, device hardware IDs, TOR exit nodes, and cyber events) with case suspects.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400">
                      {cyberEvents.length} Active Cyber Indicators
                    </span>
                  </div>
                </div>

                {/* Relationship Flow Schema (Section 27 Blueprint) */}
                <section className="rounded-xl border border-outline-variant bg-surface-container p-5">
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant font-label-mono">
                    Cyber Graph Relationship Chain (Section 27 Blueprint)
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-3 py-3 font-mono text-xs text-center">
                    <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2">
                      <div className="font-bold text-blue-400">PERSON</div>
                      <div className="text-[10px] text-outline">Person A</div>
                    </div>
                    <span className="text-outline font-bold">-[USES]-&gt;</span>
                    <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">
                      <div className="font-bold text-emerald-400">DEVICE</div>
                      <div className="text-[10px] text-outline">DEV_MACBOOK_PRO</div>
                    </div>
                    <span className="text-outline font-bold">-[CONNECTED_FROM]-&gt;</span>
                    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2">
                      <div className="font-bold text-amber-400">IP ADDRESS</div>
                      <div className="text-[10px] text-outline">185.220.101.5</div>
                    </div>
                    <span className="text-outline font-bold">-[ASSOCIATED_WITH]-&gt;</span>
                    <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2">
                      <div className="font-bold text-rose-400">CYBER EVENT</div>
                      <div className="text-[10px] text-outline">TOR Exit Node</div>
                    </div>
                    <span className="text-outline font-bold">-[RELATED_TO]-&gt;</span>
                    <div className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-3 py-2">
                      <div className="font-bold text-purple-400">CASE</div>
                      <div className="text-[10px] text-outline">ACTIVE</div>
                    </div>
                  </div>
                </section>

                {/* Cyber Events Table */}
                <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
                  <div className="border-b border-outline-variant bg-surface-container-high p-4 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Logged Cyber Indicators &amp; Threat Events</h3>
                    <span className="text-xs text-outline">Real-time threat feed</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-high/50 border-b border-outline-variant font-label-mono text-[11px] uppercase text-on-surface-variant">
                      <tr>
                        <th className="p-3.5">Event ID</th>
                        <th className="p-3.5">Suspect</th>
                        <th className="p-3.5">IP Address</th>
                        <th className="p-3.5">MAC &amp; Device ID</th>
                        <th className="p-3.5">Event Type &amp; Domain</th>
                        <th className="p-3.5">Anonymizer</th>
                        <th className="p-3.5">Threat Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/50">
                      {cyberEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="p-3.5 font-mono text-outline">{evt.id}</td>
                          <td className="p-3.5 font-bold text-on-surface">{evt.suspect}</td>
                          <td className="p-3.5 font-mono text-amber-400 font-bold">{evt.ipAddress}</td>
                          <td className="p-3.5 font-mono">
                            <div className="text-on-surface">{evt.deviceId}</div>
                            <div className="text-[10px] text-outline">{evt.macAddress}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-on-surface">{evt.eventType}</div>
                            <div className="text-[11px] text-primary">{evt.domain}</div>
                          </td>
                          <td className="p-3.5">
                            {evt.isVpnOrTor ? (
                              <span className="rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                                VPN / TOR DETECTED
                              </span>
                            ) : (
                              <span className="text-outline text-[11px]">Direct Connection</span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-rose-400 font-mono text-sm">{evt.riskScore}/100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CaseGate>
        </main>
      </div>
    </div>
  );
}
