"use client";

import React, { useState } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   TYPES & MOCK DATA
   ────────────────────────────────────────────── */
type Project = {
  id: string;
  name: string;
  description: string;
  status: "on_track" | "at_risk" | "behind";
  progress: number;
  sprint: { name: string; daysLeft: number; velocity: number };
  team: { initials: string; color: string }[];
  openPRs: number;
  blockers: number;
};

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "Payment API v2",
    description: "New payment processing pipeline with Stripe integration and webhook handling.",
    status: "on_track",
    progress: 78,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 92 },
    team: [
      { initials: "RP", color: "bg-blue-500/20 text-blue-400" },
      { initials: "AK", color: "bg-teal-500/20 text-teal-400" },
      { initials: "OT", color: "bg-orange-500/20 text-orange-400" },
    ],
    openPRs: 4,
    blockers: 0,
  },
  {
    id: "2",
    name: "User Dashboard Redesign",
    description: "Complete overhaul of the engineering dashboard with real-time metrics and AI insights.",
    status: "on_track",
    progress: 65,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 88 },
    team: [
      { initials: "LC", color: "bg-purple-500/20 text-purple-400" },
      { initials: "PS", color: "bg-pink-500/20 text-pink-400" },
    ],
    openPRs: 6,
    blockers: 0,
  },
  {
    id: "3",
    name: "Auth Service Migration",
    description: "Migrate authentication from legacy system to OAuth 2.0 + SSO integration.",
    status: "at_risk",
    progress: 42,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 64 },
    team: [
      { initials: "OT", color: "bg-orange-500/20 text-orange-400" },
      { initials: "AK", color: "bg-teal-500/20 text-teal-400" },
    ],
    openPRs: 2,
    blockers: 1,
  },
  {
    id: "4",
    name: "Mobile Onboarding Flow",
    description: "New user onboarding experience for the mobile app with progressive disclosure.",
    status: "on_track",
    progress: 25,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 95 },
    team: [
      { initials: "PS", color: "bg-pink-500/20 text-pink-400" },
      { initials: "RP", color: "bg-blue-500/20 text-blue-400" },
      { initials: "LC", color: "bg-purple-500/20 text-purple-400" },
    ],
    openPRs: 3,
    blockers: 0,
  },
  {
    id: "5",
    name: "Infrastructure Monitoring",
    description: "Deploy Prometheus + Grafana stack with custom alerting rules for all services.",
    status: "behind",
    progress: 30,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 55 },
    team: [
      { initials: "OT", color: "bg-orange-500/20 text-orange-400" },
    ],
    openPRs: 1,
    blockers: 2,
  },
  {
    id: "6",
    name: "API Rate Limiting",
    description: "Implement intelligent rate limiting with per-tenant quotas and burst handling.",
    status: "on_track",
    progress: 90,
    sprint: { name: "Sprint 24", daysLeft: 3, velocity: 100 },
    team: [
      { initials: "AK", color: "bg-teal-500/20 text-teal-400" },
      { initials: "RP", color: "bg-blue-500/20 text-blue-400" },
    ],
    openPRs: 1,
    blockers: 0,
  },
];

const statusConfig = {
  on_track: { label: "On Track", cls: "bg-success/15 text-success border-success/20" },
  at_risk: { label: "At Risk", cls: "bg-warning/15 text-warning border-warning/20" },
  behind: { label: "Behind", cls: "bg-danger/15 text-danger border-danger/20" },
};

const progressColor = {
  on_track: "bg-success",
  at_risk: "bg-warning",
  behind: "bg-danger",
};

/* ──────────────────────────────────────────────
   PROJECT DETAIL SPECIFIC MOCK DATA
   ────────────────────────────────────────────── */
type ProjectDetail = {
  stack: string;
  failedDeploys: number;
  openTickets: number;
  openPRs: number;
  blockedCount: number;
  jiraTickets: {
    id: string;
    title: string;
    status: "Doing" | "Review" | "Blocked" | "Done";
    tab: "in_progress" | "review" | "blocked";
  }[];
  commits: {
    message: string;
    author: string;
    time: string;
    hash: string;
  }[];
};

const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  // Auth Service Migration
  "3": {
    stack: "Node.js · Supabase · JWT · Express",
    failedDeploys: 3,
    openTickets: 7,
    openPRs: 2,
    blockedCount: 1,
    jiraTickets: [
      { id: "MRI-88", title: "Refactor JWT middleware to support refresh tokens", status: "Doing", tab: "in_progress" },
      { id: "MRI-91", title: "Add rate limiting to /auth/login endpoint", status: "Doing", tab: "in_progress" },
      { id: "MRI-85", title: "OAuth2 Google login integration", status: "Review", tab: "review" },
      { id: "MRI-79", title: "Fix token expiry race condition on mobile", status: "Blocked", tab: "blocked" },
    ],
    commits: [
      { message: "fix: resolve JWT expiry issue on token refresh", author: "daniel", time: "23 min ago", hash: "#a4f21c" },
      { message: "refactor: move auth middleware to shared lib", author: "daniel", time: "3 hrs ago", hash: "#b92de1" },
      { message: "feat: add login rate limiter — express-rate-limit", author: "francis", time: "5 hrs ago", hash: "#cc1a88" },
      { message: "chore: update Supabase auth config for prod env", author: "sultan", time: "yesterday", hash: "#d03f55" },
    ],
  },
  // Payment API
  "1": {
    stack: "Go · PostgreSQL · Stripe · Redis",
    failedDeploys: 0,
    openTickets: 4,
    openPRs: 4,
    blockedCount: 0,
    jiraTickets: [
      { id: "MRI-95", title: "Stripe webhook retry logic implementation", status: "Doing", tab: "in_progress" },
      { id: "MRI-94", title: "Audit log model for billing transactions", status: "Review", tab: "review" },
    ],
    commits: [
      { message: "feat: add idempotency keys to stripe customer creation", author: "raj", time: "1 hr ago", hash: "#f2a89c" },
      { message: "fix: payment intent status webhook validation", author: "amara", time: "3 hrs ago", hash: "#bd31fa" },
    ],
  },
  // Default fallback
  default: {
    stack: "React · Next.js · TailwindCSS · TypeScript",
    failedDeploys: 0,
    openTickets: 5,
    openPRs: 3,
    blockedCount: 0,
    jiraTickets: [
      { id: "MRI-102", title: "Implement dark mode styles for chart widgets", status: "Doing", tab: "in_progress" },
      { id: "MRI-105", title: "Refactor dynamic routing layout structure", status: "Review", tab: "review" },
    ],
    commits: [
      { message: "feat: add light/dark mode design tokens", author: "sultan", time: "1 hr ago", hash: "#e2c5fa" },
      { message: "fix: handle hydration mismatch on layout load", author: "priya", time: "4 hrs ago", hash: "#b9f3e4" },
    ],
  },
};

/* ──────────────────────────────────────────────
   PROJECTS PAGE COMPONENT
   ────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [jiraTab, setJiraTab] = useState<"in_progress" | "review" | "blocked">("in_progress");
  const [periodFilter, setPeriodFilter] = useState<"today" | "this_week" | "sprint_12">("today");

  const filtered = PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  // If a project is selected, render the detail view
  if (selectedProjectId) {
    const project = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];
    const details = PROJECT_DETAILS[project.id] || PROJECT_DETAILS.default;
    const sc = statusConfig[project.status];

    // Filter Jira tickets for the current active tab
    const activeJiraTickets = details.jiraTickets.filter((t) => t.tab === jiraTab);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button & Header */}
        <div>
          <button
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0 mb-4"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {project.name === "Auth Service Migration" ? "Auth service" : project.name} — Project view
            </h1>

            {/* Time Filter Segmented Control */}
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
        </div>

        {/* ── Main Specs Card ── */}
        <div className="bg-surface border border-border rounded-2xl p-6 relative flex flex-col md:flex-row md:items-center gap-5 justify-between">
          <div className="flex items-start gap-4">
            {/* White lock/key icon matching mockup */}
            <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center text-accent flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">
                  {project.name === "Auth Service Migration" ? "Auth service" : project.name}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sc.cls}`}>
                  {sc.label}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5 font-medium">
                {details.stack}
              </p>
            </div>
          </div>

          {/* Quick Metrics Numbers */}
          <div className="grid grid-cols-4 gap-2 md:gap-6 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{details.failedDeploys}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">Failed deploys</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{details.openTickets}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">Open tickets</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{details.openPRs}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">PRs open</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{details.blockedCount}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">Blocked</p>
            </div>
          </div>
        </div>

        {/* ── Details Grid Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Jira tickets Panel */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="text-accent">{DashboardIcons.jira}</span>
                Jira tickets
              </h3>

              {/* Sub-tabs inside Jira */}
              <div className="flex items-center gap-1 p-0.5 bg-background border border-border rounded-xl">
                {(["in_progress", "review", "blocked"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setJiraTab(tab)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer border-none ${
                      jiraTab === tab
                        ? "bg-surface-elevated text-foreground border border-border"
                        : "bg-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    {tab === "in_progress" ? "In progress" : tab === "review" ? "Review" : "Blocked"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets list */}
            <div className="space-y-1 pt-1">
              {activeJiraTickets.length > 0 ? (
                activeJiraTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl hover:bg-surface-hover/50 border border-transparent transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[12px] font-semibold text-accent font-mono flex-shrink-0">
                        {ticket.id}
                      </span>
                      <span className="text-[13px] text-foreground/80 truncate">
                        {ticket.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border whitespace-nowrap ${
                      ticket.status === "Blocked"
                        ? "bg-danger/15 text-danger border-danger/20"
                        : ticket.status === "Review"
                        ? "bg-warning/15 text-warning border-warning/20"
                        : "bg-accent-muted text-accent border border-accent-border/30"
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-dark text-center py-6">No tickets in this state.</p>
              )}
            </div>
          </div>

          {/* Recent Commits Panel */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-accent">{DashboardIcons.github}</span>
              Recent commits
            </h3>

            {/* Commits List */}
            <div className="space-y-4 pt-1">
              {details.commits.map((c, i) => (
                <div key={i} className="flex items-start justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="text-[13px] text-foreground/90 font-medium leading-normal hover:text-accent transition-colors cursor-pointer truncate">
                      {c.message}
                    </p>
                    <p className="text-[11px] text-muted-dark mt-1 font-medium">
                      <span className="text-muted hover:text-foreground transition-colors cursor-pointer">{c.author}</span>
                      {" · "}{c.time}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent-muted border border-accent-border/20 px-2 py-0.5 rounded-md flex-shrink-0">
                    {c.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted mt-1">
            {PROJECTS.length} active projects across your engineering teams.
          </p>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 w-full sm:w-72 focus-within:border-accent-border transition-colors">
          <span className="text-muted-dark">{DashboardIcons.search}</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-dark flex-1"
          />
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((project) => {
          const sc = statusConfig[project.status];
          const pc = progressColor[project.status];
          return (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="bg-surface border border-border rounded-xl p-5 hover:border-accent-border transition-all group cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${sc.cls}`}
                >
                  {sc.label}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-dark font-mono">
                    {project.sprint.name} · {project.sprint.daysLeft}d left
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {project.progress}%
                  </span>
                </div>
                <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pc} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                {/* Team avatars */}
                <div className="flex items-center -space-x-1.5">
                  {project.team.map((member, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-surface ${member.color}`}
                    >
                      {member.initials}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-dark">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9" />
                    </svg>
                    {project.openPRs} PRs
                  </span>
                  {project.blockers > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-danger">
                      ⚠ {project.blockers} blocker{project.blockers > 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-dark font-mono">
                    vel: {project.sprint.velocity}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
