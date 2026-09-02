"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";

const categories = [
  { value: "kidnapping", label: "Kidnapping & Extortion" },
  { value: "cyber", label: "Cyber Fraud & Financial Intercept" },
  { value: "narcotics", label: "Narcotics Trafficking" },
  { value: "money_laundering", label: "Money Laundering" },
  { value: "arms", label: "Arms Trafficking" },
];

const dataSourceOptions = [
  { key: "fir", label: "FIR / Legal Documents", icon: "description" },
  { key: "cdr", label: "CDR & Tower Records", icon: "call" },
  { key: "financial", label: "Financial & Crypto Ledger", icon: "account_balance" },
  { key: "surveillance", label: "Surveillance & CCTV Intel", icon: "videocam" },
];

export default function NewCasePage() {
  const router = useRouter();
  const { addCase } = useAppData();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("high");
  const [description, setDescription] = useState("");
  const [investigator, setInvestigator] = useState("admin");
  const [sources, setSources] = useState<string[]>(["fir", "cdr"]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSource = (key: string) => {
    setSources((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Case title is required.");
      return;
    }
    if (!category) {
      setError("Select a category for this investigation.");
      return;
    }
    setError("");
    setSubmitting(true);
    const created = addCase({ name: title.trim(), desc: description.trim(), category, priority });
    setSubmitting(false);
    router.push(`/case/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="Initiate New Investigation"
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10 flex justify-center">
          <div className="bg-surface-container w-full max-w-2xl rounded-xl border border-outline-variant shadow-2xl flex flex-col my-4">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high/40 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Initiate New Investigation</h2>
                <p className="text-xs text-outline mt-1">Open a secure channel for cross-case data aggregation</p>
              </div>
              <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-variant/50 transition">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </Link>
            </div>

            <form
              className="p-6 overflow-y-auto space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-2">Case Title / Operation Name</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary transition text-sm"
                    placeholder="e.g. Operation Nightfall / Red Falcon..."
                    type="text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2">Investigation Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary transition text-sm appearance-none"
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-2">Case Identification Code</label>
                  <div className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3.5 py-2.5 text-outline text-xs font-mono flex items-center justify-between">
                    Auto-generated on save
                    <span className="material-symbols-outlined text-sm">lock</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-2">Priority Level</label>
                  <div className="flex gap-4">
                    {(["low", "medium", "high"] as const).map((level) => (
                      <label key={level} className="flex-1 cursor-pointer">
                        <input
                          className="peer sr-only"
                          name="priority"
                          type="radio"
                          value={level}
                          checked={priority === level}
                          onChange={() => setPriority(level)}
                        />
                        <div
                          className={`text-center px-4 py-2.5 rounded-lg border text-xs font-bold transition-all capitalize ${
                            priority === level
                              ? level === "high"
                                ? "bg-rose-500/20 border-rose-500 text-rose-400"
                                : level === "medium"
                                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                                : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                              : "border-outline-variant bg-surface-container-lowest text-outline hover:border-outline"
                          }`}
                        >
                          {level}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-2">Initial Intelligence &amp; Incident Summary</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary transition text-sm resize-none"
                    placeholder="Brief summary of initial intelligence or incident report..."
                    rows={4}
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-2">Lead Investigator Assigned</label>
                  <div className="relative">
                    <select
                      value={investigator}
                      onChange={(e) => setInvestigator(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3.5 py-2.5 text-on-surface focus:outline-none focus:border-primary transition text-sm appearance-none"
                    >
                      <option value="admin">Aarav Mehta (Admin)</option>
                      <option value="smith">Det. J. Smith (Investigator)</option>
                      <option value="patel">Analyst C. Patel (Intelligence)</option>
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">person</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-2">Initial Data Sources to Sync</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dataSourceOptions.map((source) => (
                      <label
                        key={source.key}
                        className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={sources.includes(source.key)}
                          onChange={() => toggleSource(source.key)}
                          className="rounded text-primary focus:ring-0"
                        />
                        <span className="material-symbols-outlined text-primary text-sm">{source.icon}</span>
                        <span className="text-xs font-medium text-on-surface">{source.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-400">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>{error}</span>
                </div>
              )}
            </form>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-high/40 rounded-b-xl flex justify-end gap-3">
              <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition text-xs font-semibold">
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition text-xs font-bold flex items-center gap-2 disabled:opacity-60 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                {submitting ? "Creating..." : "Create Investigation"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
