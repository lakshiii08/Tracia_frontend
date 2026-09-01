"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useMemo, useState } from "react";

const roles = ["Admin", "Investigator", "Analyst", "Auditor"];
const initialUsers = [
  { id: "USR-001", name: "Aarav Mehta", operator: "ALPHA_77", role: "Admin", status: "Active" },
  { id: "USR-014", name: "Mira Rao", operator: "DELTA_14", role: "Investigator", status: "Active" },
  { id: "USR-021", name: "Kabir Shah", operator: "ECHO_21", role: "Analyst", status: "Review" },
  { id: "USR-032", name: "Naina Verma", operator: "SIGMA_32", role: "Auditor", status: "Active" },
];

export default function ProfilePage() {
  const [users, setUsers] = useState(initialUsers);
  const [role, setRole] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const visible = useMemo(() => users.filter(u => (role === "All" || u.role === role) && `${u.name} ${u.operator} ${u.role}`.toLowerCase().includes(query.toLowerCase())), [users, role, query]);
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(null), 2200); };

  return <div className="min-h-screen bg-background text-on-surface"><Navbar title="Workspace" /><div className="flex min-h-[calc(100vh-4rem)]"><Sidebar /><main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
    {notice && <div role="status" className="fixed right-5 top-5 z-50 rounded-lg border border-primary/30 bg-surface-container-high px-4 py-3 text-sm text-primary shadow-xl">{notice}</div>}
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4"><div><Link href="/dashboard" className="text-sm text-primary hover:underline">← Dashboard</Link><h1 className="mt-3 text-3xl font-bold">Operator Profile & Roles</h1><p className="mt-1 text-outline">Manage operator identity and frontend role assignments.</p></div><Link href="/settings" className="rounded-lg border border-outline-variant px-4 py-2 text-sm hover:border-primary/50">Settings</Link></div>
      <section className="mb-5 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-outline-variant bg-surface-container p-5"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">A7</div><p className="mt-4 text-xl font-semibold">ALPHA_77</p><p className="text-sm text-outline">Aarav Mehta · Admin</p><div className="mt-5 space-y-3 text-sm"><Status label="Clearance" value="LEVEL 04"/><Status label="Session" value="SECURE"/><Status label="Access" value="ACTIVE"/></div></div>
        <div className="rounded-xl border border-outline-variant bg-surface-container p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Role permissions</h2><p className="mt-1 text-xs text-outline">Current demo permissions. Enforcement will move to the backend.</p></div><span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">ADMIN</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Permission name="Case management"/><Permission name="Evidence review"/><Permission name="Entity resolution"/><Permission name="Graph intelligence"/><Permission name="Analytics"/><Permission name="Audit review"/></div></div>
      </section>
      <section className="rounded-xl border border-outline-variant bg-surface-container p-5"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-semibold">User & role management</h2><p className="mt-1 text-xs text-outline">Review demo operators and adjust their frontend role state.</p></div><div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search operator..." className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary"/><select value={role} onChange={e => setRole(e.target.value)} className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary"><option>All</option>{roles.map(r => <option key={r}>{r}</option>)}</select></div></div>
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-outline-variant text-xs text-outline"><tr><th className="px-3 py-3">Operator</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead><tbody className="divide-y divide-outline-variant/40">{visible.map(u => <tr key={u.id} className="hover:bg-surface-container-low"><td className="px-3 py-4"><p className="font-medium">{u.name}</p><p className="font-mono text-xs text-outline">{u.operator} · {u.id}</p></td><td className="px-3 py-4"><select value={u.role} onChange={e => setUsers(list => list.map(x => x.id === u.id ? {...x, role: e.target.value} : x))} className="rounded-md border border-outline-variant bg-background px-2 py-1.5 text-xs"><option>Admin</option><option>Investigator</option><option>Analyst</option><option>Auditor</option></select></td><td className="px-3 py-4"><span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary">● {u.status}</span></td><td className="px-3 py-4"><button onClick={() => notify(`${u.operator} role update queued for backend.`)} className="rounded-lg border border-outline-variant px-3 py-1.5 text-xs hover:border-primary/50">Save role</button></td></tr>)}</tbody></table>{!visible.length && <div className="py-12 text-center text-sm text-outline">No operators match this filter.</div>}</div>
      </section>
    </div>
  </main></div></div>;
}
function Permission({name}:{name:string}) { return <div className="flex items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-low p-3 text-sm"><span className="material-symbols-outlined text-base text-primary">check_circle</span>{name}</div>; }
function Status({label,value}:{label:string;value:string}) { return <div className="flex justify-between border-b border-outline-variant/40 pb-2"><span className="text-outline">{label}</span><span className="font-mono text-xs text-primary">{value}</span></div>; }

