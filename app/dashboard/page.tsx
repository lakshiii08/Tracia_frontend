"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppData } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const toneClass: Record<string, string> = {
  person: "bg-entity-person", account: "bg-entity-account", outline: "bg-outline", organization: "bg-entity-organization",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cases } = useAppData();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(c => `${c.id} ${c.name} ${c.desc} ${c.status}`.toLowerCase().includes(q));
  }, [query, cases]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  useEffect(() => {
    const created = searchParams.get("created");
    if (created) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      showNotice(`${created} created and added to Active Cases.`);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {notice && <div role="status" className="fixed right-5 top-5 z-50 rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm text-on-surface shadow-xl">{notice}</div>}
      <Navbar title="Case Management" showSearch />
      <div className="flex min-h-[calc(100vh-4rem)]"><Sidebar />
        <main className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Active Cases</h3><p className="mt-1 font-label-mono text-label-mono text-on-surface-variant">Terminal Session: SECURE // REGION-04</p></div>
            <Link href="/case/new" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-fixed"><span className="material-symbols-outlined text-[20px]">add</span>New Case</Link>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[['folder_open','Total Active Cases','142','primary'],['warning','Flagged Anomalies','23','risk'],['pending_actions','Pending Resolutions','8','vehicle']].map(([icon,label,value,tone]) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border border-surface-variant/50 bg-surface-container p-5 hover:border-primary/30">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tone === 'risk' ? 'bg-entity-risk/10 text-entity-risk' : tone === 'vehicle' ? 'bg-entity-vehicle/10 text-entity-vehicle' : 'bg-primary/10 text-primary'}`}><span className="material-symbols-outlined">{icon}</span></div>
                <div><p className="text-sm text-on-surface-variant">{label}</p><p className="font-headline-md text-headline-md text-on-surface">{value}</p></div>
              </div>
            ))}
          </section>

          {filtered.length ? <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filtered.map(c => {
              const card = <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-surface-variant/50 bg-surface-container p-5 transition-all hover:-translate-y-1 hover:border-primary/50">
                <div className={`absolute left-0 top-0 h-full w-1 ${toneClass[c.tone]}`} />
                <div className="flex items-start justify-between gap-2"><span className="rounded bg-primary/10 px-2 py-0.5 font-label-mono text-label-mono text-primary">{c.id}</span><span className="rounded border border-outline/20 bg-outline/10 px-2 py-0.5 text-xs text-outline">● {c.status}</span></div>
                <div><h4 className="font-headline-md text-headline-md text-on-surface">{c.name}</h4><p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{c.desc}</p></div>
                <div className="mt-auto flex items-center justify-between border-t border-surface-variant/50 pt-4 text-sm text-on-surface-variant"><span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">{c.icon}</span>{c.entities} Entities</span><span className="font-code-sm text-code-sm">{c.date}</span></div>
              </div>;
              return <Link key={c.id} href={c.href || `/case/${c.id}`} className="block">{card}</Link>;
            })}
          </section> : <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-12 text-center"><span className="material-symbols-outlined text-4xl text-outline">search_off</span><h4 className="mt-3 font-headline-md text-on-surface">No cases found</h4><p className="mt-1 text-sm text-on-surface-variant">Try a different search term.</p><button onClick={() => setQuery("")} className="mt-4 rounded-lg border border-primary/30 px-4 py-2 text-sm text-primary">Clear search</button></div>}

          <footer className="flex flex-col gap-2 border-t border-surface-variant/30 pt-6 font-label-mono text-xs text-outline/60 sm:flex-row sm:items-center sm:justify-between"><span>[TERMINAL_ID: ALPHA_77]</span><span>DATA_STREAM: ENCRYPTED_AES256</span><span>TRACIA Intelligence Platform</span></footer>
        </main>
      </div>
    </div>
  );
}