"use client";
import { useMemo, useState } from "react";
import { useAppData } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AuditLogPage() {
  const { auditTrail } = useAppData();
  const [query, setQuery] = useState("");
  const entries = useMemo(() => auditTrail.filter(e => `${e.time} ${e.message} ${e.actor}`.toLowerCase().includes(query.toLowerCase())), [auditTrail, query]);
  return <div className="min-h-screen bg-background text-on-surface"><Navbar title="Security Audit" /><div className="flex min-h-[calc(100vh-4rem)]"><Sidebar /><main className="min-w-0 flex-1 p-5 lg:p-8"><div className="mx-auto max-w-6xl"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="font-label-mono text-xs text-primary">SECURITY / AUDIT</div><h1 className="mt-1 text-3xl font-bold">Audit Log</h1><p className="mt-2 text-on-surface-variant">Chronological record of investigation actions recorded by the active session.</p></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search audit events..." className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 text-sm outline-none focus:border-primary" /></div><div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container"><div className="grid grid-cols-[150px_1fr_140px] gap-4 border-b border-outline-variant p-4 text-[10px] font-label-mono text-outline"><span>TIME</span><span>EVENT</span><span>ACTOR</span></div>{entries.length ? entries.map(entry=><div key={entry.id} className="grid grid-cols-[150px_1fr_140px] gap-4 border-b border-outline-variant/40 p-4 text-sm hover:bg-surface-container-low"><span className="font-code-sm text-primary">{entry.time}</span><span>{entry.message}</span><span className="font-code-sm text-outline">{entry.actor}</span></div>) : <div className="p-12 text-center text-sm text-outline">No audit events match this search.</div>}</div></div></main></div></div>;
}
