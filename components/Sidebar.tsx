"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppData } from "@/lib/store";

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { selectedCase, selectCase } = useAppData();

  const caseHref = selectedCase ? `/case/${selectedCase.id}` : "/case/TR-102";

  const items = [
    { id: "directory", href: "/dashboard", icon: "folder_managed", label: "Case Directory", requiresCase: false },
    { id: "workspace", href: caseHref, icon: "workspaces", label: selectedCase ? `Workspace (${selectedCase.id})` : "Case Workspace", requiresCase: true },
    { id: "graph", href: "/graph", icon: "hub", label: "Knowledge Graph", requiresCase: true },
    { id: "entity-resolution", href: "/entity-resolution", icon: "group_add", label: "Entity Resolution", requiresCase: true },
    { id: "cdr", href: "/cdr", icon: "call", label: "CDR Analysis", requiresCase: true },
    { id: "timeline", href: "/timeline", icon: "timeline", label: "Timeline Intelligence", requiresCase: true },
    { id: "evidence-integrity", href: "/evidence-integrity", icon: "verified", label: "Evidence & Custody", requiresCase: true },
    { id: "copilot", href: "/copilot", icon: "smart_toy", label: "AI Copilot & GraphRAG", requiresCase: true },
    { id: "cyber-intel", href: "/cyber-intel", icon: "security", label: "Cyber Intelligence", requiresCase: true },
    { id: "audit-log", href: "/audit-log", icon: "history", label: "Audit & Security Logs", requiresCase: true },
  ];

  return (
    <aside className={`${mobile ? "" : "hidden lg:flex"} w-[260px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest p-4`}>
      <div className="mb-4 rounded-lg border border-outline-variant bg-surface-container p-3">
        <div className="flex items-center justify-between font-bold tracking-tight text-on-surface">
          <span>TRACIA</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
          SESSION: ACTIVE // REGION-04
        </div>
      </div>

      {/* Selected Case Card */}
      <div className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-wider">Active Case File</span>
          {selectedCase && (
            <button
              onClick={() => selectCase(null)}
              className="text-[10px] text-primary hover:underline"
              title="Deselect active case"
            >
              Clear
            </button>
          )}
        </div>
        {selectedCase ? (
          <div>
            <Link
              href={`/case/${selectedCase.id}`}
              className="font-bold text-xs text-on-surface hover:text-primary transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">folder_open</span>
              {selectedCase.id}: {selectedCase.name}
            </Link>
            <div className="mt-1.5 pt-1.5 border-t border-outline-variant/40 text-[10px] text-on-surface-variant space-y-1">
              <div className="font-semibold text-outline">Assignees:</div>
              <div className="truncate font-medium text-on-surface">
                {selectedCase.assignees?.map((a) => a.name).join(", ") || "Inspector A."}
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/dashboard"
            className="block text-center py-1.5 px-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-400 hover:bg-amber-500/20 transition"
          >
            ⚠️ No Case Selected
            <div className="text-[9px] font-normal text-on-surface-variant mt-0.5">Click to choose a case file</div>
          </Link>
        )}
      </div>

      <Link
        href="/case/new"
        className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-on-primary hover:bg-primary-fixed transition shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>New Investigation
      </Link>

      <nav className="space-y-1 overflow-y-auto pr-1 flex-1" aria-label="Workspace">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                isActive
                  ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.requiresCase && !selectedCase && (
                <span className="material-symbols-outlined text-[14px] text-amber-400" title="Case selection required">
                  lock
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
