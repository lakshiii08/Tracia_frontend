"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";
import { useAuthorization } from "@/auth/useAuthorization";

export default function Navbar({
  title = "TRACIA Intelligence Platform",
  showSearch = false,
}: {
  title?: string;
  showSearch?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { cases, selectedCase, selectCase } = useAppData();
  const { currentUser } = useAuthorization();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const nav = [
    ["/dashboard", "dashboard", "Dashboard"],
    ["/graph", "hub", "Intelligence"],
    ["/copilot", "smart_toy", "Copilot"],
    ["/alerts", "notifications", "Alerts"],
  ];

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-16 items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="shrink-0">
          <div className="font-headline-md font-bold tracking-tight text-primary">TRACIA</div>
          <div className="hidden text-[10px] text-outline sm:block">{title}</div>
        </Link>

        {/* Case Selector Dropdown in Navbar */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              selectedCase
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {selectedCase ? "folder_open" : "warning"}
            </span>
            <span className="max-w-[200px] truncate">
              {selectedCase ? `${selectedCase.id}: ${selectedCase.name}` : "Select Case File"}
            </span>
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-outline-variant bg-surface-container-high p-2 shadow-2xl z-50 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-outline uppercase font-bold border-b border-outline-variant/40 mb-1">
                Select Active Case File:
              </div>
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    selectCase(c.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                    selectedCase?.id === c.id
                      ? "bg-primary/20 text-primary font-bold"
                      : "hover:bg-surface-variant text-on-surface"
                  }`}
                >
                  <div>
                    <div className="font-bold">{c.id} - {c.name}</div>
                    <div className="text-[10px] text-on-surface-variant truncate">
                      Assigned: {c.assignees?.map((a) => a.name).join(", ") || "Inspector A."}
                    </div>
                  </div>
                  {selectedCase?.id === c.id && (
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                  )}
                </button>
              ))}

              {selectedCase && (
                <button
                  onClick={() => {
                    selectCase(null);
                    setDropdownOpen(false);
                  }}
                  className="w-full mt-1 border-t border-outline-variant/40 pt-1.5 text-center text-xs text-rose-400 hover:underline"
                >
                  Clear Selected Case File
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="hidden w-full max-w-md md:block">
          <input
            aria-label="Search"
            placeholder="Search entity, phone, vehicle, case..."
            className="w-full rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
      )}

      <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
        {nav.map(([href, icon, label]) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                ? "font-semibold text-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 text-xs">
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-2.5 py-1 text-xs">
          <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
          <span className="font-bold text-on-surface">{currentUser.name}</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary border border-primary/20">
            {currentUser.role}
          </span>
        </div>
        <Link href="/settings" aria-label="Settings" className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </Link>
        <button onClick={logout} aria-label="Logout" className="text-on-surface-variant hover:text-primary" title="Sign out session">
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </header>
  );
}
