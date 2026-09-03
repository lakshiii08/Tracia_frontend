"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";
import { useAuthorization } from "@/auth/useAuthorization";
export default function AppHeader({
  title = "Operations Workspace",
  showSearch = false,
  onSearchChange,
  searchValue = "",
  onToggleSidebar,
}: {
  title?: string;
  showSearch?: boolean;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();
  const { cases, selectedCase, selectCase } = useAppData();
  const { currentUser } = useAuthorization();
  const [caseDropdownOpen, setCaseDropdownOpen] = useState(false);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest/80 px-6 backdrop-blur-xl shrink-0">
      {/* Left: Page Title & Active Case File */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-bold text-sm text-on-surface sm:text-base">{title}</h1>
            <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline">
            <span className="text-primary font-semibold">TRACIA</span>
            <span>//</span>
            <span>SECURE TERMINAL</span>
          </div>
        </div>

        {/* Active Case Selector Pill in Header */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setCaseDropdownOpen(!caseDropdownOpen)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
              selectedCase
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {selectedCase ? "folder_open" : "warning"}
            </span>
            <span className="max-w-[160px] truncate font-mono">
              {selectedCase ? `${selectedCase.id}` : "Select Case"}
            </span>
            <span className="material-symbols-outlined text-[15px]">arrow_drop_down</span>
          </button>

          {caseDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-outline-variant bg-surface-container-high p-2 shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-outline uppercase font-bold border-b border-outline-variant/40 mb-1">
                Switch Active Case:
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
                    <div className="font-bold truncate">{c.id}: {c.name}</div>
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
                  Clear Active Selection
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar if enabled */}
      {showSearch && (
        <div className="hidden flex-1 max-w-md lg:block">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search suspect, phone, vehicle, records..."
              className="w-full rounded-full border border-outline-variant bg-surface-container-low py-1.5 pl-9 pr-4 text-xs text-on-surface outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Right Controls: Notifications, User Badge, Settings & Logout */}
      <div className="flex items-center gap-2 text-xs shrink-0">

        {/* Alerts Bell */}
        <Link
          href="/alerts"
          className="relative rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition"
          title="Alerts & Notifications"
          aria-label="Alerts"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
        </Link>

        {/* Operator Profile Chip */}
        <Link
          href="/profile"
          className="hidden sm:flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-2.5 py-1 text-xs hover:border-primary/50 transition"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
          <span className="font-bold text-on-surface max-w-[110px] truncate">{currentUser.name}</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary border border-primary/20">
            {currentUser.role === "INVESTIGATING_OFFICER"
              ? "INVESTIGATOR"
              : currentUser.role === "INTELLIGENCE_OFFICER"
              ? "ANALYST"
              : currentUser.role}
          </span>
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-primary transition"
          title="Workspace Settings"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Link>

        {/* Logout */}
        <button
          onClick={logout}
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container hover:text-rose-400 transition"
          title="Sign out session"
          aria-label="Logout"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </header>
  );
}
