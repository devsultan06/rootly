"use client";

import React, { useState } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   MOCK DATA FOR REPORTS
   ────────────────────────────────────────────── */
type ReportType = "standup" | "weekly" | "retro" | "custom";

type ReportContent = {
  title: string;
  sections: {
    label: string;
    badge?: { text: string; type: "success" | "danger" | "warning" | "neutral" };
    content: string;
  }[];
};

const REPORT_CONTENTS: Record<ReportType, ReportContent> = {
  standup: {
    title: "Today's standup — auto-generated 8:00 AM",
    sections: [
      {
        label: "Shipped yesterday",
        badge: { text: "Done", type: "success" },
        content: "Auth refactor (Daniel) · 3 payment tickets (Francis)",
      },
      {
        label: "In progress today",
        content: "Mobile onboarding UI · API rate limiting · Jira MRI-91",
      },
      {
        label: "Blocked",
        badge: { text: "Blocked", type: "danger" },
        content: "Payment API — waiting on 3rd party sandbox creds",
      },
      {
        label: "Risk",
        badge: { text: "Watch review", type: "warning" },
        content: "Sprint velocity dropped 40% · 2 PRs pending review",
      },
    ],
  },
  weekly: {
    title: "Weekly engineering summary — Week 24",
    sections: [
      {
        label: "Sprint Velocity",
        badge: { text: "87/100", type: "success" },
        content: "Sprint 24 velocity on track. Frontend team achieved 92% planned story completion.",
      },
      {
        label: "Shipped Services",
        content: "Payment API v2 deployed to production · Prometheus monitoring alerts configured",
      },
      {
        label: "Key Blockers",
        badge: { text: "Resolved", type: "neutral" },
        content: "Auth service legacy SSO blocker resolved by the Backend team on Wednesday.",
      },
      {
        label: "Risk Mitigation",
        badge: { text: "Critical", type: "danger" },
        content: "Mobile app build sizing increased by 15MB. Review session scheduled for Monday.",
      },
    ],
  },
  retro: {
    title: "Sprint 23 Retrospective report",
    sections: [
      {
        label: "What went well",
        badge: { text: "Success", type: "success" },
        content: "Seamless integration of Stripe checkout pipeline with zero downtime. High code-test coverage.",
      },
      {
        label: "What could be improved",
        content: "Estimates for Auth database migrations were off by 2.5 days. Need smaller, chunked PRs.",
      },
      {
        label: "Action Items",
        badge: { text: "Todo", type: "warning" },
        content: "Pre-approve database schema updates with platform team 48 hours prior to future sprints.",
      },
    ],
  },
  custom: {
    title: "Custom AI Report — Backend shipments in October",
    sections: [
      {
        label: "Query Input",
        badge: { text: "On Demand", type: "neutral" },
        content: '"Summarize backend deployments and key achievements during October 2026"',
      },
      {
        label: "October Summary",
        content: "Backend team shipped 14 core services. Migrated user profile database indexing which improved load query latency by 45%. Deployed API Rate Limiting gateway.",
      },
    ],
  },
};

/* ──────────────────────────────────────────────
   REPORTS PAGE COMPONENT
   ────────────────────────────────────────────── */
export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("standup");
  const [periodFilter, setPeriodFilter] = useState<"today" | "this_week" | "sprint_12">("today");
  const [customQuery, setCustomQuery] = useState("");

  const activeContent = REPORT_CONTENTS[selectedReport];

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    
    // Simulate generating a custom report
    REPORT_CONTENTS.custom.sections[0].content = `"${customQuery}"`;
    REPORT_CONTENTS.custom.sections[1].content = `Based on your request, I analyzed the workspace data: Deployed ${customQuery.includes("auth") ? "Auth Service updates" : "payment gateways"} and resolved 4 related Jira issues. Team velocity remains high.`;
    setSelectedReport("custom");
    setCustomQuery("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="text-sm text-muted mt-1">
            AI-generated summaries of your sprint progress, standups, and team metrics.
          </p>
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1 p-0.5 bg-surface border border-border rounded-xl w-fit">
          {(["today", "this_week", "sprint_12"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border-none ${
                periodFilter === period
                  ? "bg-surface-elevated text-foreground border border-border"
                  : "bg-transparent text-muted hover:text-foreground"
              }`}
            >
              {period === "today" ? "Today" : period === "this_week" ? "This Week" : "Sprint 12"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Daily standup */}
        <div
          onClick={() => setSelectedReport("standup")}
          className={`bg-surface border rounded-2xl p-5 cursor-pointer transition-all hover:border-accent-border/40 flex items-start gap-4 ${
            selectedReport === "standup" ? "border-accent-border ring-1 ring-accent-border/30 bg-surface-hover/30" : "border-border"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Daily standup</h3>
            <p className="text-xs text-muted leading-normal">
              Auto-generated each morning. Who did what, what's blocked, what ships today.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[9px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded">
                Auto-generated
              </span>
              <span className="text-[10px] text-muted-dark font-mono">Today 8:00 AM</span>
            </div>
          </div>
        </div>

        {/* Card 2: Weekly engineering */}
        <div
          onClick={() => setSelectedReport("weekly")}
          className={`bg-surface border rounded-2xl p-5 cursor-pointer transition-all hover:border-accent-border/40 flex items-start gap-4 ${
            selectedReport === "weekly" ? "border-accent-border ring-1 ring-accent-border/30 bg-surface-hover/30" : "border-border"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12H18L15 21L9 3L6 12H2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Weekly engineering</h3>
            <p className="text-xs text-muted leading-normal">
              Sprint progress, PRs merged, velocity, blockers, and risk summary for the week.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[9px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded">
                Auto-generated
              </span>
              <span className="text-[10px] text-muted-dark font-mono">Every Monday</span>
            </div>
          </div>
        </div>

        {/* Card 3: Sprint retrospective */}
        <div
          onClick={() => setSelectedReport("retro")}
          className={`bg-surface border rounded-2xl p-5 cursor-pointer transition-all hover:border-accent-border/40 flex items-start gap-4 ${
            selectedReport === "retro" ? "border-accent-border ring-1 ring-accent-border/30 bg-surface-hover/30" : "border-border"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Sprint retrospective</h3>
            <p className="text-xs text-muted leading-normal">
              End-of-sprint summary with what was completed, delayed, and why. Includes team contributions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[9px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded">
                Auto-generated
              </span>
              <span className="text-[10px] text-muted-dark font-mono">End of sprint</span>
            </div>
          </div>
        </div>

        {/* Card 4: Custom report */}
        <div
          onClick={() => setSelectedReport("custom")}
          className={`bg-surface border rounded-2xl p-5 cursor-pointer transition-all hover:border-accent-border/40 flex items-start gap-4 ${
            selectedReport === "custom" ? "border-accent-border ring-1 ring-accent-border/30 bg-surface-hover/30" : "border-border"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">Custom report</h3>
            <p className="text-xs text-muted leading-normal">
              Ask the AI to generate any report on demand based on specific queries or timelines.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[9px] font-bold tracking-wider uppercase bg-accent-muted text-accent border border-accent-border/30 px-2 py-0.5 rounded">
                On demand
              </span>
              <span className="text-[10px] text-muted-dark font-mono">Any time</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Report Content Preview Panel ── */}
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border/40">
          <span className="text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          <h3 className="text-sm font-semibold text-foreground">
            {activeContent.title}
          </h3>
        </div>

        {/* Content rows matching mockup */}
        <div className="space-y-4">
          {activeContent.sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-6">
              <div className="w-full sm:w-40 flex-shrink-0">
                <p className="text-xs font-semibold text-muted tracking-wide uppercase sm:pt-1">
                  {sec.label}
                </p>
              </div>
              <div className="flex-1 flex items-start gap-2.5 min-w-0">
                {sec.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                    sec.badge.type === "success"
                      ? "bg-success/15 text-success border-success/20"
                      : sec.badge.type === "danger"
                      ? "bg-danger/15 text-danger border-danger/20"
                      : sec.badge.type === "warning"
                      ? "bg-warning/15 text-warning border-warning/20"
                      : "bg-surface-elevated text-muted-dark border-border"
                  }`}>
                    {sec.badge.text}
                  </span>
                )}
                <p className="text-[13px] text-foreground/95 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Ask AI Prompt Box at the bottom ── */}
      <form onSubmit={handleAskAI} className="bg-surface border border-border rounded-2xl p-3 flex items-center gap-3 shadow-sm focus-within:border-accent-border transition-colors">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder={"Ask about reports... \"Summarize this week's activity\" or \"What did backend ship in October?\""}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-dark px-2"
        />
        <button
          type="submit"
          disabled={!customQuery.trim()}
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all ${
            customQuery.trim()
              ? "bg-accent text-black hover:bg-accent-hover"
              : "bg-surface-elevated text-muted-dark cursor-not-allowed"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
          </svg>
          Ask AI
        </button>
      </form>
    </div>
  );
}
