"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/dashboard", "folder_managed", "Case Files"],
  ["/case/TR-102", "workspaces", "Case Workspace"],
  ["/graph", "hub", "Knowledge Graph"],
  ["/entity-resolution", "group_add", "Entity Resolution"],
  ["/cdr", "call", "CDR Analysis"],
  ["/timeline", "timeline", "Timeline Intelligence"],
  ["/evidence-integrity", "verified", "Evidence & Custody"],
  ["/copilot", "smart_toy", "AI Copilot & GraphRAG"],
  ["/cyber-intel", "security", "Cyber Intelligence"],
  ["/audit-log", "history", "Audit & Security Logs"],
];

export default function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`${mobile ? "" : "hidden lg:flex"} w-[250px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest p-4`}>
      <div className="mb-6 rounded-lg border border-outline-variant bg-surface-container p-3">
        <div className="font-bold tracking-tight">TRACIA</div>
        <div className="mt-1 flex items-center gap-2 text-[10px] font-label-mono text-entity-phone">
          <span className="h-1.5 w-1.5 rounded-full bg-entity-phone animate-pulse" />
          ACTIVE SESSION
        </div>
      </div>
      <Link
        href="/case/new"
        className="mb-5 flex items-center justify-center gap-2 rounded-lg bg-primary-container py-2.5 text-sm font-semibold text-on-primary-container hover:brightness-110"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>New Investigation
      </Link>
      <nav className="space-y-1 overflow-y-auto pr-1" aria-label="Workspace">
        {items.map(([href, icon, label]) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
