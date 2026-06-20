"use client";

import React, { useState, useRef, useEffect } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────── */
type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  citations?: { label: string; url: string }[];
  timestamp: string;
};

/* ──────────────────────────────────────────────
   SUGGESTED QUESTIONS
   ────────────────────────────────────────────── */
const SUGGESTIONS = [
  "What happened in the last standup?",
  "Who is blocked right now?",
  "What PRs need review today?",
  "Summarize this week's sprint progress",
  "What did the backend team ship this week?",
  "Are there any overdue tickets?",
];

/* ──────────────────────────────────────────────
   MOCK AI RESPONSES
   ────────────────────────────────────────────── */
const AI_RESPONSES: Record<string, { content: string; citations: { label: string; url: string }[] }> = {
  "Generate daily standup based on today's activity": {
    content:
      "Based on today's activity across Slack, GitHub, and Jira, here is your generated daily standup:\n\n**Yesterday's Progress**:\n• Merged authorization bug fix in [auth-service/pulls/124](https://github.com)\n• Resolved Jira ticket [SEC-92: Auth Service Token validation](https://jira.com)\n• Participated in onboarding alignment on [#mobile-alerts](https://slack.com)\n\n**Today's Plan**:\n• Complete dashboard user testing and UI integration\n• Start onboarding infrastructure configuration changes\n\n**Blockers**:\n• None currently blocking my primary tasks, though Auth Service API is experiencing latency.",
    citations: [
      { label: "PR #124", url: "#" },
      { label: "SEC-92", url: "#" },
      { label: "#mobile-alerts", url: "#" },
    ],
  },
  "Summarize Sprint 24 progress and achievements": {
    content:
      "Here is the sprint summary for Sprint 24 (Engineering Health: 87/100):\n\n**Overall Progress**:\n• **Sprint velocity is down by 15%** compared to Sprint 23, mostly due to blocker delays.\n• **18 PRs opened** / **12 PRs merged** this week.\n• Story Points: 48 completed / 72 planned.\n\n**Key Achievements**:\n• **Payment API** successfully deployed to production [PR #342](https://github.com)\n• Auth Service critical hotfix deployed and tested.\n\n**Risks/Items Alerted**:\n• 2 overdue Jira tickets (assigned to Backend Team)\n• Auth Service dependency migration pending security signoff.",
    citations: [
      { label: "PR #342", url: "#" },
      { label: "Sprint Board", url: "#" },
      { label: "Health Score", url: "#" },
    ],
  },
  "Find blockers and overdue tasks right now": {
    content:
      "I found the following blockers affecting your engineering team right now:\n\n1. **Auth Service Migration Blocked** 🚨 (High Risk)\n• **Detail**: Blocked waiting on security review from the platform team.\n• **Time**: Pending for 2 days.\n• **Proof**: [JIRA-1847](https://jira.com) / Slack thread in [#backend-alerts](https://slack.com).\n\n2. **Overdue Tickets** ⚠ (Medium Risk)\n• **Detail**: 2 critical database cleanup tasks are 4 days overdue.\n• **Assignee**: Backend Team.\n• **Proof**: [JIRA-1792](https://jira.com), [JIRA-1793](https://jira.com).",
    citations: [
      { label: "JIRA-1847", url: "#" },
      { label: "#backend-alerts", url: "#" },
      { label: "JIRA-1792", url: "#" },
      { label: "JIRA-1793", url: "#" },
    ],
  },
  default: {
    content:
      "Based on the latest data from your connected tools, here's what I found:\n\n**Sprint Progress**: The current sprint is 68% complete with 3 days remaining. The backend team has shipped 4 out of 6 planned stories. The frontend team is on track with the dashboard redesign.\n\n**Blockers**: There's 1 active blocker — the Auth Service migration is waiting on a security review from the platform team. This has been pending for 2 days.\n\n**Recent Activity**: 42 commits were pushed today across 6 repositories. 12 PRs have been merged, and 3 are awaiting review.",
    citations: [
      { label: "JIRA-1847", url: "#" },
      { label: "PR #342", url: "#" },
      { label: "Sprint Board", url: "#" },
    ],
  },
};

/* ──────────────────────────────────────────────
   ASK AI PAGE
   ────────────────────────────────────────────── */
export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const resp = AI_RESPONSES[msg] || AI_RESPONSES.default;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: resp.content,
        citations: resp.citations,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle URL query parameter ?q=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("q");
      if (query) {
        // Wait a small bit to ensure everything is mounted and animated
        const timer = setTimeout(() => {
          sendMessage(query);
        }, 100);
        // Clean URL parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("q");
        window.history.replaceState({}, document.title, url.pathname);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] animate-fade-in">
      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-accent-border flex items-center justify-center text-accent mb-6">
            {DashboardIcons.sparkles}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
            Ask your company AI
          </h1>
          <p className="text-sm text-muted max-w-md text-center mb-10">
            Ask anything about your engineering team. I have context from Jira,
            GitHub, Slack, and your meeting notes.
          </p>

          {/* Suggestions grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-left text-sm text-muted hover:text-foreground p-3.5 rounded-xl border border-border hover:border-accent-border bg-surface hover:bg-surface-elevated transition-all cursor-pointer group"
              >
                <span className="text-accent mr-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  →
                </span>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat messages ── */}
      {!isEmpty && (
        <div className="flex-1 overflow-y-auto space-y-6 pb-4 px-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-lg bg-accent-muted border border-accent-border flex items-center justify-center text-accent flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-accent text-black rounded-br-sm"
                    : "bg-surface border border-border rounded-bl-sm"
                }`}
              >
                <div
                  className={`text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user" ? "text-black" : "text-foreground/90"
                  }`}
                >
                  {msg.content}
                </div>
                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border-subtle flex flex-wrap gap-1.5">
                    {msg.citations.map((c) => (
                      <a
                        key={c.label}
                        href={c.url}
                        className="text-[11px] font-mono text-accent bg-accent-muted px-2 py-0.5 rounded-md border border-accent-border no-underline hover:bg-accent/20 transition-colors"
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                )}
                <p
                  className={`text-[10px] mt-2 ${
                    msg.role === "user"
                      ? "text-black/50"
                      : "text-muted-dark"
                  } font-mono`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-muted border border-accent-border flex items-center justify-center text-accent flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
              </div>
              <div className="bg-surface border border-border rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-pulse [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-accent/20 animate-pulse [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="flex-shrink-0 pt-3">
        <div className="flex items-end gap-2 p-2 bg-surface border border-border rounded-xl focus-within:border-accent-border transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your engineering team..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder-muted-dark px-2 py-2 max-h-32"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer border-none ${
              input.trim() && !isTyping
                ? "bg-accent text-black hover:bg-accent-hover"
                : "bg-surface-elevated text-muted-dark cursor-not-allowed"
            }`}
          >
            {DashboardIcons.send}
          </button>
        </div>
        <p className="text-[10px] text-muted-dark text-center mt-2 font-mono">
          AI has context from Jira, GitHub, Slack, and Calendar. All answers
          include source citations.
        </p>
      </div>
    </div>
  );
}
