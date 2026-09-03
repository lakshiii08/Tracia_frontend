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
          title="Intelligence Copilot"
          onToggleSidebar={() => setSidebarOpen(true)}
        />
        <main className="min-w-0 flex-1 flex flex-col">
          <CaseGate moduleTitle="Intelligence Copilot">
            <div className="p-4 lg:p-6 flex flex-col flex-1">
              <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col space-y-4">
                {/* Header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant/60 pb-3">
                  <div>
                    <h1 className="text-xl font-bold text-on-surface">Investigation Copilot</h1>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Query case records, communications, entity links, and evidence for the selected investigation.
                    </p>
                  </div>
                  {selectedCase && (
                    <span className="text-xs font-mono text-outline">
                      Context: {selectedCase.id}
                    </span>
                  )}
                </div>

                {/* Chat Conversation Area */}
                <div className="flex-1 rounded-xl border border-outline-variant bg-surface-container p-4 overflow-y-auto space-y-4 min-h-[360px]">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div
                        className={`max-w-2xl rounded-xl p-3.5 text-xs leading-relaxed space-y-2 ${
                          m.role === "user"
                            ? "bg-primary text-on-primary font-medium"
                            : "bg-surface-container-low border border-outline-variant text-on-surface"
                        }`}
                      >
                        {m.intent && (
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary uppercase font-semibold">
                            <span className="material-symbols-outlined text-[13px]">insights</span>
                            Intent: {m.intent}
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{m.text}</p>

                        {m.supportingPaths && m.supportingPaths.length > 0 && (
                          <div className="mt-2 rounded-lg border border-outline-variant/60 bg-surface-container-high/50 p-2.5 text-[11px] font-mono space-y-1">
                            <div className="font-semibold text-primary">Relational Paths:</div>
                            {m.supportingPaths.map((path, pIdx) => (
                              <div key={pIdx} className="text-on-surface-variant">{path}</div>
                            ))}
                          </div>
                        )}

                        {m.sources && m.sources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1.5 text-[10px] text-outline">
                            <span className="font-medium">Sources:</span>
                            {m.sources.map((src, sIdx) => (
                              <span key={sIdx} className="rounded bg-surface-variant px-1.5 py-0.5 text-on-surface-variant border border-outline-variant/40">
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
                      <div className="max-w-2xl rounded-xl p-3 text-xs bg-surface-container-low border border-outline-variant text-on-surface flex items-center gap-2">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        <span className="text-outline">Analyzing case records and connections...</span>
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
                    placeholder="Ask about suspects, accounts, CDR calls, or timeline events..."
                    className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2.5 text-xs outline-none focus:border-primary transition"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !input.trim()}
                    className="rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary flex items-center gap-1.5 disabled:opacity-50 hover:bg-primary-container transition shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span> Send
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
