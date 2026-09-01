"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function SettingsPage() {
  const [dark, setDark] = useState(true);
  const [compact, setCompact] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface"><Navbar title="Workspace" /><div className="flex min-h-[calc(100vh-4rem)]"><Sidebar /><main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
      {saved && <div role="status" className="fixed right-5 top-5 z-50 rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm text-primary shadow-xl">Settings saved locally.</div>}
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div><Link href="/dashboard" className="text-sm text-primary hover:underline">← Dashboard</Link><h1 className="mt-3 text-3xl font-bold">Settings</h1><p className="mt-1 text-outline">Configure operator workspace preferences for this frontend session.</p></div>
          <Link href="/profile" className="rounded-lg border border-outline-variant px-4 py-2 text-sm hover:border-primary/50">Operator profile</Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <section className="space-y-5">
            <div className="rounded-xl border border-outline-variant bg-surface-container p-5">
              <h2 className="font-semibold">Workspace</h2>
              <div className="mt-4 divide-y divide-outline-variant/50">
                <Toggle label="Dark terminal mode" description="Keep the investigation interface in dark mode." checked={dark} onChange={setDark} />
                <Toggle label="Compact density" description="Reduce spacing for high-volume case review." checked={compact} onChange={setCompact} />
                <Toggle label="Auto-save drafts" description="Keep unfinished form state in the browser session." checked={autoSave} onChange={setAutoSave} />
              </div>
            </div>
            <div className="rounded-xl border border-outline-variant bg-surface-container p-5">
              <h2 className="font-semibold">Session</h2>
              <label className="mt-4 block text-sm text-on-surface-variant">Inactivity timeout</label>
              <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary sm:max-w-xs">
                <option value="15">15 minutes</option><option value="30">30 minutes</option><option value="60">60 minutes</option><option value="120">2 hours</option>
              </select>
              <p className="mt-2 text-xs text-outline">Backend session enforcement will be connected during authentication integration.</p>
            </div>
            <div className="flex justify-end"><button onClick={save} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:opacity-90">Save preferences</button></div>
          </section>
          <aside className="h-fit rounded-xl border border-outline-variant bg-surface-container p-5">
            <p className="font-label-mono text-xs text-primary">FRONTEND MODE</p><h2 className="mt-2 font-semibold">Configuration status</h2>
            <div className="mt-4 space-y-3 text-sm"><Status label="UI preferences" value="Local"/><Status label="Authentication" value="Demo"/><Status label="API connection" value="Pending"/><Status label="Database" value="Pending"/></div>
          </aside>
        </div>
      </div>
    </main>
    </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs text-outline">{description}</p></div><button type="button" aria-pressed={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-primary" : "bg-outline/30"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} /></button></div>;
}
function Status({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3"><span className="text-on-surface-variant">{label}</span><span className="font-mono text-xs text-primary">{value}</span></div>; }

