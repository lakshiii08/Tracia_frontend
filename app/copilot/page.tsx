"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Message {
  role: "user" | "assistant";
  text: string;
  intent?: string;
  supportingPaths?: string[];
  sources?: string[];
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Greetings Inspector. I am TRACIA's AI Investigation Copilot powered by GraphRAG. Ask me any question regarding suspects, call networks, timeline events, or evidence files.",
    },
    {
      role: "user",
      text: "Show me all high-risk targets connected to Operation Nightfall (TR-102) and their burner phone communications.",
    },
    {
      role: "assistant",
      text: "Based on multi-hop GraphRAG analysis across Neo4j relationship graphs and ingested CDR logs, **Vikram Sharma** (PER_10023, High Risk) is connected to burner phone **+91 9123456780** with 342s of intercepted call activity on 2025-05-10.",
      intent: "Graph Search + CDR Analysis",
      supportingPaths: [
        "(Vikram Sharma:Person) -[:USES]-> (+91 9876543210:Phone) -[:CONNECTED_TO]-> (+91 9123456780:BurnerPhone)",
        "(Vikram Sharma:Person) -[:INVOLVED_IN]-> (TR-102:Case)",
      ],
      sources: ["incident_report_01.pdf", "cdr_dump_q1.csv", "Neo4j Graph Node PER_10023"],
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    const prompt = input.trim();
    setInput("");

    // Simulate GraphRAG processing response
    setTimeout(() => {
      const assistantMsg: Message = {
        role: "assistant",
        text: `Synthesized response for query "${prompt}": Entity Vikram Sharma maintains a 94% probabilistic match with V. Sharma across FIR documents and CDR call records. SHA-256 hash verified on Blockchain TxID 0x7f8a3291bc40.`,
        intent: "GraphRAG Vector + Neo4j Search",
        supportingPaths: [
          "(Entity:Vikram Sharma) -[:CONFIRMED_MATCH 94%]--------> (Entity:V. Sharma)",
          "(Case:TR-102) -[:HAS_EVIDENCE]-> (Evidence:EVD_101) -[:VERIFIED_BY]-> (Blockchain:0x7f8a)",
        ],
        sources: ["TRACIA Neo4j Graph Database", "Blockchain Custody Registry", "CDR Analysis Cluster #1"],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Navbar title="TRACIA · AI Copilot & GraphRAG Assistant" showSearch />
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-5 lg:p-8 flex flex-col">
          <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col space-y-6">
            {/* Header banner */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-label-mono text-xs text-primary">AI INTELLIGENCE LAYER</div>
                <h1 className="text-3xl font-bold">AI Copilot &amp; GraphRAG</h1>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Grounded investigation assistant integrating semantic vector search with Neo4j multi-hop knowledge graph retrieval.
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
            <div className="flex-1 rounded-xl border border-outline-variant bg-surface-container p-5 overflow-y-auto space-y-5">
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
                className="rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-on-primary flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">send</span> Send Query
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
