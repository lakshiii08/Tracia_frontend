"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ title = "TRACIA Intelligence Platform", showSearch = false }: { title?: string; showSearch?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = [
    ["/dashboard", "dashboard", "Dashboard"],
    ["/graph", "hub", "Intelligence"],
    ["/copilot", "smart_toy", "Copilot"],
    ["/alerts", "notifications", "Alerts"],
  ];
  const logout = async () => { try { await fetch("/api/auth/logout", { method: "POST" }); } finally { router.replace("/login"); } };
  return (
    <header className="sticky top-0 z-50 flex min-h-16 items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <Link href="/dashboard" className="shrink-0">
        <div className="font-headline-md font-bold tracking-tight text-primary">TRACIA</div>
        <div className="hidden text-[10px] text-outline sm:block">{title}</div>
      </Link>
      {showSearch && <div className="hidden w-full max-w-xl md:block"><input aria-label="Search" placeholder="Search entity, phone, vehicle, case..." className="w-full rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm outline-none focus:border-primary" /></div>}
      <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
        {nav.map(([href, icon, label]) => <Link key={href} href={href} className={`flex items-center gap-1.5 text-sm transition-colors ${pathname === href || (href !== "/dashboard" && pathname.startsWith(href)) ? "font-semibold text-primary" : "text-on-surface-variant hover:text-primary"}`}><span className="material-symbols-outlined text-[18px]">{icon}</span>{label}</Link>)}
      </nav>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/profile" className="hidden text-on-surface-variant hover:text-primary sm:block">Inspector A.</Link>
        <Link href="/settings" aria-label="Settings" className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">settings</span></Link>
        <button onClick={logout} aria-label="Logout" className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">logout</span></button>
      </div>
    </header>
  );
}
