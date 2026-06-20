"use client";

import React from "react";
import Link from "next/link";
import { DashboardIcons } from "./components/DashboardIcons";

/* ──────────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────────── */
const TEAMS = [
  { name: "Frontend Team", status: "green" as const },
  { name: "Backend Team", status: "green" as const },
  { name: "Infrastructure", status: "yellow" as const },
];

const ACTIVITY = [
  { label: "Commits", value: 42, icon: "⚡" },
  { label: "PRs Opened", value: 18, icon: "🔀" },
  { label: "PRs Merged", value: 12, icon: "✅" },
  { label: "Jira Updates", value: 27, icon: "📋" },
];

const SPRINT = {
  name: "Sprint 24",
  daysLeft: 3,
  totalDays: 14,
  velocity: 85,
  velocityTrend: -8,
  storiesCompleted: 18,
  storiesTotal: 26,
  pointsCompleted: 42,
  pointsTotal: 58,
};

const RISKS = [
  {
    text: "Auth Service blocked — waiting on security review",
    severity: "high" as const,
    source: "jira" as const,
    ref: "JIRA-1847",
    aiDetected: true,
    age: "2 days",
  },
  {
    text: "Sprint velocity down 15% from last sprint",
    severity: "medium" as const,
    source: "jira" as const,
    ref: "Sprint Board",
    aiDetected: true,
    age: "auto",
  },
  {
    text: "2 overdue tickets in Backend Team",
    severity: "low" as const,
    source: "jira" as const,
    ref: "BACK-201, BACK-214",
    aiDetected: false,
    age: "3 days",
  },
];

const CHANGES = [
  {
    text: "Payment API deployed to production",
    time: "2h ago",
    dot: "accent",
    source: "github" as const,
    refs: [
      { label: "PR #342", type: "github" as const },
      { label: "JIRA-1820", type: "jira" as const },
    ],
  },
  {
    text: "Authentication bug #1847 fixed and verified",
    time: "3h ago",
    dot: "accent",
    source: "github" as const,
    refs: [
      { label: "PR #339", type: "github" as const },
      { label: "JIRA-1847", type: "jira" as const },
      { label: "#backend-alerts", type: "slack" as const },
    ],
  },
  {
    text: "User dashboard v2 completed and merged",
    time: "4h ago",
    dot: "accent",
    source: "github" as const,
    refs: [
      { label: "PR #337", type: "github" as const },
      { label: "DASH-189", type: "jira" as const },
    ],
  },
  {
    text: "Mobile team started onboarding flow",
    time: "5h ago",
    dot: "muted",
    source: "jira" as const,
    refs: [
      { label: "MOBILE-92", type: "jira" as const },
      { label: "#mobile-team", type: "slack" as const },
    ],
  },
  {
    text: "Infrastructure alerting thresholds updated",
    time: "6h ago",
    dot: "muted",
    source: "github" as const,
    refs: [{ label: "PR #335", type: "github" as const }],
  },
];

const DEPLOYMENTS = [
  {
    service: "payment-service",
    version: "v2.4.1",
    status: "success" as const,
    time: "2h ago",
    env: "production",
  },
  {
    service: "auth-service",
    version: "v1.8.3",
    status: "failed" as const,
    time: "5h ago",
    env: "staging",
  },
  {
    service: "dashboard-web",
    version: "v3.1.0",
    status: "success" as const,
    time: "4h ago",
    env: "production",
  },
];

/* ──────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const statusColor = {
  green: { bg: "bg-success/20", ring: "ring-success/30", dot: "bg-success" },
  yellow: { bg: "bg-warning/20", ring: "ring-warning/30", dot: "bg-warning" },
  red: { bg: "bg-danger/20", ring: "ring-danger/30", dot: "bg-danger" },
};

const sourceIcon: Record<string, React.ReactNode> = {
  github: DashboardIcons.github,
  jira: DashboardIcons.jira,
  slack: DashboardIcons.slack,
};

const refColor: Record<string, string> = {
  github: "text-[#E6EDF3] bg-[#E6EDF3]/8 border-[#E6EDF3]/15",
  jira: "text-[#4C9AFF] bg-[#2684FF]/8 border-[#2684FF]/15",
  slack: "text-[#E01E5A] bg-[#E01E5A]/8 border-[#E01E5A]/15",
};

/* ──────────────────────────────────────────────
   OVERVIEW PAGE
   ────────────────────────────────────────────── */
export default function DashboardOverview() {
  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
          {greeting} 👋
        </h1>
        <p className="text-sm text-muted mt-1">
          Here&apos;s what&apos;s happening across your engineering org today.
        </p>
      </div>

      {/* ── Quick Ask AI Bar (wow moment) ── */}
      <Link
        href="/dashboard/ask-ai"
        className="group flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-accent-border transition-all no-underline cursor-pointer"
      >
        <div className="w-9 h-9 rounded-xl bg-accent-muted border border-accent-border flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
          {DashboardIcons.sparkles}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted group-hover:text-muted-light transition-colors">
            Ask anything about your engineering team...{" "}
            <span className="text-muted-dark italic">
              &quot;Why is the app slow today?&quot;
            </span>
          </p>
        </div>
        <span className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-dark font-mono bg-surface-elevated px-2.5 py-1 rounded-lg border border-border-subtle flex-shrink-0">
          <kbd className="font-mono">⌘</kbd>
          <kbd className="font-mono">K</kbd>
        </span>
      </Link>

      {/* ── Health Score + Teams ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Health score card */}
        <div className="lg:col-span-1 bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-accent-border transition-colors">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Engineering Health
          </p>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${87 * 2.64} ${100 * 2.64}`}
                className="drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground tracking-tight">
                87
              </span>
              <span className="text-[10px] text-muted-dark font-mono">
                / 100
              </span>
            </div>
          </div>
        </div>

        {/* Team statuses */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
            Team Status
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEAMS.map((team) => {
              const c = statusColor[team.status];
              return (
                <div
                  key={team.name}
                  className={`flex items-center gap-3 p-4 rounded-lg ${c.bg} ring-1 ${c.ring}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                  <span className="text-sm font-medium text-foreground">
                    {team.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Activity + Sprint Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Activity card */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
            Activity Today
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ACTIVITY.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated border border-border-subtle"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xl font-bold text-foreground tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-muted-dark">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sprint Progress card */}
        <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium text-muted uppercase tracking-wider">
              Sprint Progress
            </p>
            <span className="text-[10px] font-mono text-muted-dark">
              {SPRINT.name} · {SPRINT.daysLeft}d left
            </span>
          </div>

          {/* Story points bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted">Story Points</span>
              <span className="text-xs font-semibold text-foreground">
                {SPRINT.pointsCompleted}/{SPRINT.pointsTotal}
              </span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{
                  width: `${(SPRINT.pointsCompleted / SPRINT.pointsTotal) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Stories bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted">Stories</span>
              <span className="text-xs font-semibold text-foreground">
                {SPRINT.storiesCompleted}/{SPRINT.storiesTotal}
              </span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all duration-700"
                style={{
                  width: `${(SPRINT.storiesCompleted / SPRINT.storiesTotal) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Velocity */}
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <span className="text-xs text-muted">Velocity</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {SPRINT.velocity}%
              </span>
              <span
                className={`text-[11px] font-mono ${
                  SPRINT.velocityTrend < 0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {SPRINT.velocityTrend > 0 ? "+" : ""}
                {SPRINT.velocityTrend}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Risks + Deployments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Risks card */}
        <div className="lg:col-span-3 bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
            Current Risks
          </p>
          <div className="space-y-2.5">
            {RISKS.map((risk, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  risk.severity === "high"
                    ? "bg-danger-muted border-danger/20"
                    : risk.severity === "medium"
                    ? "bg-warning/5 border-warning/15"
                    : "bg-surface-elevated border-border-subtle"
                }`}
              >
                <span
                  className={`text-sm mt-0.5 ${
                    risk.severity === "high"
                      ? "animate-pulse"
                      : ""
                  }`}
                >
                  ⚠
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {risk.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* Source badge */}
                    <span className="flex items-center gap-1 text-[10px] text-muted-dark">
                      <span className="opacity-70">
                        {sourceIcon[risk.source]}
                      </span>
                      {risk.ref}
                    </span>
                    {risk.aiDetected && (
                      <>
                        <span className="w-0.5 h-0.5 rounded-full bg-muted-dark" />
                        <span className="text-[9px] font-mono text-accent bg-accent-muted px-1.5 py-0.5 rounded border border-accent-border">
                          AI Detected
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deployments card */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
            Recent Deployments
          </p>
          <div className="space-y-2.5">
            {DEPLOYMENTS.map((dep, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated border border-border-subtle"
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    dep.status === "success" ? "bg-success" : "bg-danger"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {dep.service}
                  </p>
                  <p className="text-[10px] text-muted-dark font-mono">
                    {dep.version} → {dep.env}
                  </p>
                </div>
                <span className="text-[10px] text-muted-dark font-mono flex-shrink-0">
                  {dep.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── What Changed Today (with proof links) ── */}
      <div className="bg-surface border border-border rounded-xl p-6 hover:border-accent-border transition-colors">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            What Changed Today
          </p>
          <span className="text-[10px] font-mono text-accent bg-accent-muted px-2 py-0.5 rounded-full border border-accent-border">
            AI Generated
          </span>
        </div>
        <div className="space-y-0">
          {CHANGES.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-3 relative">
              {/* Timeline line */}
              {i < CHANGES.length - 1 && (
                <div className="absolute left-[5px] top-[22px] w-px h-[calc(100%-6px)] bg-border" />
              )}
              <span
                className={`w-[11px] h-[11px] rounded-full flex-shrink-0 mt-1.5 ring-2 ring-surface ${
                  item.dot === "accent" ? "bg-accent" : "bg-muted-dark"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-foreground/90">{item.text}</p>
                  <span className="text-[11px] text-muted-dark font-mono whitespace-nowrap flex-shrink-0">
                    {item.time}
                  </span>
                </div>
                {/* Proof links + source badge */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="opacity-60">{sourceIcon[item.source]}</span>
                  {item.refs.map((ref) => (
                    <a
                      key={ref.label}
                      href="#"
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border no-underline hover:opacity-80 transition-opacity ${refColor[ref.type]}`}
                    >
                      {ref.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
