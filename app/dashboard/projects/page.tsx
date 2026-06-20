"use client";

import React, { useState } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   MOCK DATA
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
   PROJECTS PAGE
   ────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const filtered = PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

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
