"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppData } from "@/lib/store";

const categories = [
  { value: "kidnapping", label: "Kidnapping" },
  { value: "cyber", label: "Cyber Fraud" },
  { value: "narcotics", label: "Narcotics" },
  { value: "money_laundering", label: "Money Laundering" },
  { value: "arms", label: "Arms Trafficking" },
];

const dataSourceOptions = [
  { key: "fir", label: "FIR / Documents", icon: "description" },
  { key: "cdr", label: "CDR Records", icon: "settings_phone" },
  { key: "financial", label: "Financial Records", icon: "account_balance" },
  { key: "surveillance", label: "Surveillance", icon: "videocam" },
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
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <nav className="fixed top-0 w-full z-10 flex justify-between items-center px-gutter h-16 bg-surface-container-high/70 backdrop-blur-xl border-b border-outline-variant">
        <Link href="/dashboard" className="text-headline-lg font-headline-lg font-black text-on-surface tracking-tighter">TRACIA</Link>
      </nav>
      <div className="fixed inset-0 top-16 bg-background/80 backdrop-blur-md z-0 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
        <div className="bg-surface-container w-full max-w-2xl rounded-xl border border-outline-variant shadow-2xl flex flex-col my-8">
          <div className="px-card-padding py-4 border-b border-outline-variant flex justify-between items-center bg-surface/50 rounded-t-xl">
            <div>
              <h2 className="text-headline-md font-headline-md text-on-surface">Initiate New Investigation</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">Open a secure channel for data aggregation</p>
            </div>
            <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg hover:bg-surface-variant/50 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </Link>
          </div>

          <form
            className="p-card-padding overflow-y-auto space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Case Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-all text-body-md font-body-md"
                  placeholder="Enter operation name..."
                  type="text"
                />
              </div>

              <div>
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-all text-body-md font-body-md appearance-none"
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Case ID</label>
                <div className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface-variant text-code-sm font-code-sm flex items-center justify-between opacity-70">
                  Auto-generated on save
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Priority Level</label>
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
                        className={`text-center px-4 py-2 rounded-lg border transition-all capitalize ${
                          priority === level
                            ? level === "high"
                              ? "bg-entity-risk/20 border-entity-risk text-entity-risk"
                              : level === "medium"
                              ? "bg-entity-vehicle/20 border-entity-vehicle text-entity-vehicle"
                              : "bg-surface-variant border-outline text-on-surface"
                            : "border-outline-variant bg-surface-container-lowest text-on-surface-variant"
                        }`}
                      >
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Description / Initial Intelligence</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-all text-body-md font-body-md resize-none"
                  placeholder="Brief summary of initial intelligence or incident report..."
                  rows={4}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Lead Investigator</label>
                <div className="relative">
                  <select
                    value={investigator}
                    onChange={(e) => setInvestigator(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-3 py-2 text-on-surface focus:outline-none focus:border-primary transition-all text-body-md font-body-md appearance-none"
                  >
                    <option value="admin">Inspector A. Admin</option>
                    <option value="smith">Det. J. Smith</option>
                    <option value="doe">Agent R. Doe</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant">person</span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-body-sm font-body-sm text-on-surface-variant mb-2">Initial Data Sources to Sync</label>
                <div className="grid grid-cols-2 gap-3">
                  {dataSourceOptions.map((source) => (
                    <label
                      key={source.key}
                      className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-variant/50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={sources.includes(source.key)}
                        onChange={() => toggleSource(source.key)}
                        className="rounded"
                      />
                      <span className="material-symbols-outlined text-on-surface-variant text-sm">{source.icon}</span>
                      <span className="text-body-sm font-body-sm text-on-surface">{source.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg border border-entity-risk/30 bg-entity-risk/10 px-3 py-2.5 text-sm text-entity-risk">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            )}
          </form>

          <div className="px-card-padding py-4 border-t border-outline-variant bg-surface/50 rounded-b-xl flex justify-end gap-3">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors text-body-sm font-body-sm font-medium">
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary/90 transition-all text-body-sm font-body-sm font-bold flex items-center gap-2 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              {submitting ? "Creating..." : "Create Case"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
