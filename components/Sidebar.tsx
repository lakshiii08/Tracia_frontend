"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";
import { useAuthorization } from "@/auth/useAuthorization";
import { useTheme } from "@/components/ThemeProvider";
import type { Permission } from "@/types/accessControl";

interface NavItem {
  id: string;
  href: string;
  icon: string;
  label: string;
  requiresCase: boolean;
  requiredPermission?: Permission;
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { cases, selectedCase, selectCase } = useAppData();
  const { currentUser, hasPermission } = useAuthorization();
  const { theme } = useTheme();
  const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);

  const caseHref = selectedCase ? `/case/${selectedCase.id}` : "/case/TR-102";

  const items: NavItem[] = [
    { id: "directory", href: "/dashboard", icon: "folder_managed", label: "Case Directory", requiresCase: false },
    { id: "workspace", href: caseHref, icon: "workspaces", label: selectedCase ? `Workspace (${selectedCase.id})` : "Case Workspace", requiresCase: true, requiredPermission: "cases.view" },
    { id: "graph", href: "/graph", icon: "hub", label: "Knowledge Graph", requiresCase: true, requiredPermission: "graph.view" },
    { id: "entity-resolution", href: "/entity-resolution", icon: "group_add", label: "Entity Resolution", requiresCase: true },
    { id: "cdr", href: "/cdr", icon: "call", label: "CDR Analysis", requiresCase: true },
    { id: "timeline", href: "/timeline", icon: "timeline", label: "Timeline Intelligence", requiresCase: true },
    { id: "evidence-integrity", href: "/evidence-integrity", icon: "verified", label: "Evidence & Custody", requiresCase: true, requiredPermission: "evidence.view" },
    { id: "copilot", href: "/copilot", icon: "smart_toy", label: "Intelligence Copilot", requiresCase: true },
    { id: "cyber-intel", href: "/cyber-intel", icon: "security", label: "Cyber Intelligence", requiresCase: true },
    { id: "audit-log", href: "/audit-log", icon: "history", label: "Audit & Security Logs", requiresCase: true, requiredPermission: "audit.view" },
    { id: "analytics", href: "/analytics", icon: "insights", label: "Graph Analytics", requiresCase: false },
    { id: "report", href: "/report", icon: "description", label: "Forensic Reports", requiresCase: false },
  ];

  const canCreateCase = currentUser.role === "ADMIN" || currentUser.role === "INVESTIGATING_OFFICER";

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r border-outline-variant bg-surface-container-lowest text-on-surface z-40 select-none">
      {/* 1. Header & Brand */}
      <div className="flex items-center justify-between border-b border-outline-variant px-4 py-3.5 shrink-0">
        <Link href="/dashboard" className="relative flex h-8 w-36 items-center">
          <Image
            src={theme === "pure-white" ? "/assets/TRACIA_dashboard_white.jpeg" : "/assets/TRACIA_dashboard_black.png"}
            alt="TRACIA dashboard"
            fill
            sizes="144px"
            className="object-contain object-left"
          />
        </Link>
        <span className="h-2 w-2 rounded-full bg-emerald-500" title="System operational" />
      </div>

      {/* 2. Operator Profile Info */}
      <div className="border-b border-outline-variant bg-surface-container-low/40 p-3 shrink-0">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-surface-container transition"
          title="View Operator Profile"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs font-bold text-primary border border-primary/20">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-on-surface">{currentUser.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary border border-primary/20">
                {currentUser.role === "INVESTIGATING_OFFICER"
                  ? "INVESTIGATOR"
                  : currentUser.role === "INTELLIGENCE_OFFICER"
                  ? "ANALYST"
                  : currentUser.role}
              </span>
              <span className="text-[9px] font-mono text-outline">{currentUser.clearanceLevel || "L04"}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* 3. Case Selector & New Investigation */}
      <div className="p-3 border-b border-outline-variant space-y-2 shrink-0">
        <div className="relative">
          <button
            onClick={() => setCaseDropdownOpen(!caseDropdownOpen)}
            className={`w-full flex items-center justify-between rounded-lg border p-2 text-xs transition ${
              selectedCase
                ? "border-primary/40 bg-primary/10 text-on-surface hover:bg-primary/20"
                : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <span className="material-symbols-outlined text-[17px] text-primary shrink-0">
                {selectedCase ? "folder_open" : "warning"}
              </span>
              <div className="text-left min-w-0">
                <div className="text-[9px] uppercase font-mono font-bold text-outline">
                  {selectedCase ? "Active Case File" : "No Case Selected"}
                </div>
                <div className="truncate font-bold text-xs">
                  {selectedCase ? `${selectedCase.id}: ${selectedCase.name}` : "Select Active Case"}
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
              arrow_drop_down
            </span>
          </button>

          {caseDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-outline-variant bg-surface-container-high p-2 shadow-2xl z-50 space-y-1 max-h-60 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-mono text-outline uppercase font-bold border-b border-outline-variant/40 mb-1">
                Select Case File:
              </div>
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    selectCase(c.id);
                    setCaseDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                    selectedCase?.id === c.id
                      ? "bg-primary/20 text-primary font-bold"
                      : "hover:bg-surface-variant text-on-surface"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold truncate">{c.id} - {c.name}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">{c.desc}</div>
                  </div>
                  {selectedCase?.id === c.id && (
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0">check</span>
                  )}
                </button>
              ))}

              {selectedCase && (
                <button
                  onClick={() => {
                    selectCase(null);
                    setCaseDropdownOpen(false);
                  }}
                  className="w-full mt-1 border-t border-outline-variant/40 pt-1.5 text-center text-xs text-rose-400 hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}
        </div>

        {canCreateCase ? (
          <Link
            href="/case/new"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-xs font-bold text-on-primary hover:bg-primary-container transition shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>New Investigation
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low py-1 text-[10px] text-outline">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            <span>Case creation restricted</span>
          </div>
        )}
      </div>

      {/* 4. Navigation Items (Scrollable) */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5" aria-label="Workspace Modules">
        {items.map((item) => {
          const isPermitted = !item.requiredPermission || hasPermission(item.requiredPermission);
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          if (!isPermitted) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-outline/40 bg-surface-container-lowest border border-dashed border-outline-variant/20 cursor-not-allowed select-none"
                title={`Access Restricted for role ${currentUser.role}`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] opacity-40">{item.icon}</span>
                  <span className="line-through opacity-60 truncate">{item.label}</span>
                </div>
                <span className="rounded bg-surface-variant px-1.5 py-0.5 text-[9px] font-mono text-outline">
                  Restricted
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
                isActive
                  ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[17px] shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.requiresCase && !selectedCase && (
                <span className="material-symbols-outlined text-[12px] text-outline shrink-0" title="Case file required">
                  lock
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 5. Bottom Utility Actions */}
      <div className="border-t border-outline-variant p-2.5 space-y-0.5 shrink-0 bg-surface-container-lowest">
        <Link
          href="/alerts"
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
            pathname === "/alerts"
              ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px]">notifications</span>
            <span>Alerts &amp; Feed</span>
          </div>
        </Link>

        <Link
          href="/settings"
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition ${
            pathname === "/settings"
              ? "bg-primary/10 font-bold text-primary border-l-2 border-primary"
              : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px]">settings</span>
            <span>Settings</span>
          </div>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 transition"
          title="Sign out active session"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[17px]">logout</span>
            <span className="font-semibold">Sign Out</span>
          </div>
          <span className="material-symbols-outlined text-[13px]">chevron_right</span>
        </button>
      </div>
    </aside>
  );
}
