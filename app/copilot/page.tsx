"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import CaseGate from "@/components/CaseGate";
import { useAppData } from "@/lib/store";
import { getCopilotInitialMessages, queryCopilot } from "@/services/api/copilot";
import type { CopilotMessage } from "@/types/copilot";

export default function CopilotPage() {
  const { selectedCase } = useAppData();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCopilotInitialMessages().then(setMessages);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt) return;

    const userMsg: CopilotMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await queryCopilot(prompt, selectedCase?.id);
      const assistantMsg: CopilotMessage = {
        role: "assistant",
        text: res.text,
        intent: res.intent,
        supportingPaths: res.supportingPaths,
        sources: res.sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: CopilotMessage = {
        role: "assistant",
        text: "Failed to query Copilot reasoning service. Please check network connectivity or backend availability.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          title="AI Copilot & GraphRAG Assistant"
          showSearch
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="min-w-0 flex-1 flex flex-col">
          <CaseGate moduleTitle="AI Copilot &amp; GraphRAG Reasoning">
            <div className="p-5 lg:p-8 flex flex-col flex-1">
              <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col space-y-6">
                {/* Header banner */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-label-mono text-xs text-primary">AI INTELLIGENCE LAYER</div>
                    <h1 className="text-3xl font-bold">AI Copilot &amp; GraphRAG</h1>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Grounded investigation assistant integrating semantic vector search with Neo4j multi-hop knowledge graph retrieval for the selected case file.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary font-mono">
                      GraphRAG Active
                    </span>
                  </div>
                </div>

                {/* GraphRAG Pipeline Schema (Section 18 Blueprint) */}
                <section className="rounded-xl border border-outline-variant bg-surface-container p-4 text-xs font-mono">
                  <div className="font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label-mono">
                    GraphRAG Retrieval Flow (Section 18 Blueprint)
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[11px]">
                    <div className="rounded bg-surface-container-high p-2">1. Question</div>
                    <span>➔</span>
                    <div className="rounded bg-surface-container-high p-2">2. Intent &amp; Entity Understanding</div>
                    <span>➔</span>
                    <div className="rounded bg-surface-container-high p-2 text-primary">3. Vector Search + Neo4j Graph</div>
                    <span>➔</span>
                    <div className="rounded bg-surface-container-high p-2 text-emerald-400">4. Context Assembly</div>
                    <span>➔</span>
                    <div className="rounded bg-surface-container-high p-2 text-amber-400">5. Grounded Answer + Paths</div>
                  </div>
                </section>

                {/* Chat Conversation Area */}
                <div className="flex-1 rounded-xl border border-outline-variant bg-surface-container p-5 overflow-y-auto space-y-5 min-h-[300px]">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-3xl rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                          m.role === "user"
                            ? "bg-primary text-on-primary font-medium"
                            : "bg-surface-container-low border border-outline-variant text-on-surface"
                        }`}
                      >
                        {m.intent && (
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-primary">
                            <span className="material-symbols-outlined text-[14px]">psychology</span>
                            Intent: {m.intent}
                          </div>
                        )}
                        <p>{m.text}</p>

                        {m.supportingPaths && m.supportingPaths.length > 0 && (
                          <div className="mt-3 rounded-lg border border-primary/30 bg-surface-container-high/70 p-3 text-[11px] font-mono space-y-1">
                            <div className="font-bold text-primary">Supporting Neo4j Multi-hop Paths:</div>
                            {m.supportingPaths.map((path, pIdx) => (
                              <div key={pIdx} className="text-on-surface-variant">{path}</div>
                            ))}
                          </div>
                        )}

                        {m.sources && m.sources.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-mono text-outline">
                            <span>Grounded Sources:</span>
                            {m.sources.map((src, sIdx) => (
                              <span key={sIdx} className="rounded bg-surface-variant px-2 py-0.5 text-on-surface-variant">
                                {src}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="flex flex-col items-start">
                      <div className="max-w-3xl rounded-xl p-4 text-xs bg-surface-container-low border border-outline-variant text-on-surface flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        <span className="text-outline font-mono">GraphRAG agent traversing Neo4j knowledge graph...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Console */}
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI Copilot (e.g. Find all suspects connected to Bank Account #4567)..."
                    className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={isThinking}
                    className="rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-on-primary flex items-center gap-1.5 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span> Send Query
                  </button>
                </form>
              </div>
            </div>
          </CaseGate>
        </main>
      </div>
    </div>
  );
}
