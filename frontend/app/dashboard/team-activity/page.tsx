"use client";

import React, { useState } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   TYPES & MOCK DATA FOR ACTIVITY
   ────────────────────────────────────────────── */
type ActivityItem = {
  id: string;
  user: { name: string; initials: string; color: string };
  action: string;
  target: string;
  source: "github" | "jira" | "slack" | "calendar";
  time: string;
  group: "today" | "yesterday" | "this_week";
  type: "commit" | "pr" | "jira" | "slack";
};

const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    user: { name: "Amara K.", initials: "AK", color: "bg-teal-500/20 text-teal-400" },
    action: "merged pull request",
    target: "#342 — Fix auth token refresh logic",
    source: "github",
    time: "12 min ago",
    group: "today",
    type: "pr",
  },
  {
    id: "2",
    user: { name: "Raj P.", initials: "RP", color: "bg-blue-500/20 text-blue-400" },
    action: "pushed 3 commits to",
    target: "feature/payment-api",
    source: "github",
    time: "28 min ago",
    group: "today",
    type: "commit",
  },
  {
    id: "3",
    user: { name: "Luna C.", initials: "LC", color: "bg-purple-500/20 text-purple-400" },
    action: "moved ticket to In Review",
    target: "DASH-189 — Dashboard health score widget",
    source: "jira",
    time: "45 min ago",
    group: "today",
    type: "jira",
  },
  {
    id: "4",
    user: { name: "Omar T.", initials: "OT", color: "bg-orange-500/20 text-orange-400" },
    action: "commented in #backend-alerts",
    target: '"Auth service is back up, monitoring for the next hour"',
    source: "slack",
    time: "1h ago",
    group: "today",
    type: "slack",
  },
  {
    id: "5",
    user: { name: "Amara K.", initials: "AK", color: "bg-teal-500/20 text-teal-400" },
    action: "opened pull request",
    target: "#341 — Add rate limiting to public API endpoints",
    source: "github",
    time: "2h ago",
    group: "today",
    type: "pr",
  },
  {
    id: "6",
    user: { name: "Priya S.", initials: "PS", color: "bg-pink-500/20 text-pink-400" },
    action: "created ticket",
    target: "MOBILE-92 — Onboarding flow v2 design implementation",
    source: "jira",
    time: "3h ago",
    group: "today",
    type: "jira",
  },
  {
    id: "7",
    user: { name: "Raj P.", initials: "RP", color: "bg-blue-500/20 text-blue-400" },
    action: "deployed to staging",
    target: "payment-service v2.4.1",
    source: "github",
    time: "Yesterday, 4:32 PM",
    group: "yesterday",
    type: "commit",
  },
  {
    id: "8",
    user: { name: "Luna C.", initials: "LC", color: "bg-purple-500/20 text-purple-400" },
    action: "closed ticket",
    target: "DASH-185 — Fix timezone display in activity feed",
    source: "jira",
    time: "Yesterday, 2:15 PM",
    group: "yesterday",
    type: "jira",
  },
  {
    id: "9",
    user: { name: "Omar T.", initials: "OT", color: "bg-orange-500/20 text-orange-400" },
    action: "pushed 7 commits to",
    target: "main",
    source: "github",
    time: "Mon, 11:20 AM",
    group: "this_week",
    type: "commit",
  },
  {
    id: "10",
    user: { name: "Priya S.", initials: "PS", color: "bg-pink-500/20 text-pink-400" },
    action: "shared meeting notes for",
    target: "Sprint Planning — Week 24",
    source: "slack",
    time: "Mon, 10:00 AM",
    group: "this_week",
    type: "slack",
  },
];

const TABS = ["All", "Commits", "PRs", "Jira", "Slack"] as const;
type Tab = (typeof TABS)[number];

const tabFilter: Record<Tab, ActivityItem["type"][] | null> = {
  All: null,
  Commits: ["commit"],
  PRs: ["pr"],
  Jira: ["jira"],
  Slack: ["slack"],
};

const sourceIcon: Record<ActivityItem["source"], React.ReactNode> = {
  github: DashboardIcons.github,
  jira: DashboardIcons.jira,
  slack: DashboardIcons.slack,
  calendar: DashboardIcons.calendar,
};

const sourceLabel: Record<ActivityItem["source"], string> = {
  github: "GitHub",
  jira: "Jira",
  slack: "Slack",
  calendar: "Calendar",
};

/* ──────────────────────────────────────────────
   TYPES & MOCK DATA FOR TEAM STATUS
   ────────────────────────────────────────────── */
type StatusItem = {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  status: "active" | "idle" | "blocked";
  activityDescription: React.ReactNode;
  tags: string[];
  actionText: string;
};

const STATUS_ITEMS: Record<string, StatusItem[]> = {
  today: [
    {
      id: "status-1",
      name: "Daniel Emeka",
      role: "Backend",
      initials: "DE",
      avatarColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      status: "active",
      activityDescription: (
        <>
          Working on <span className="font-semibold text-foreground">auth refactor</span> — PR #204 merged 23 min ago
        </>
      ),
      tags: ["3 PRs this week", "Jira MRI-88", "GitHub active"],
      actionText: "View commits · See Jira tickets ↗",
    },
    {
      id: "status-2",
      name: "Francis Anyeji",
      role: "Backend",
      initials: "FA",
      avatarColor: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
      status: "active",
      activityDescription: (
        <>
          Closed 3 Jira tickets in <span className="font-semibold text-foreground">payment service</span> · working on rate limiting
        </>
      ),
      tags: ["5 tickets closed", "MRI-91 active", "No blockers"],
      actionText: "View Jira activity ↗",
    },
    {
      id: "status-3",
      name: "Taofik Opeyemi",
      role: "Frontend",
      initials: "TO",
      avatarColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      status: "idle",
      activityDescription: (
        <>
          Last active <span className="font-semibold text-foreground">2 hrs ago</span> — mobile onboarding UI, no commits today
        </>
      ),
      tags: ["1 PR open", "MRI-85 in review", "Idle"],
      actionText: "View last activity ↗",
    },
    {
      id: "status-4",
      name: "Enoch Oluwa",
      role: "Frontend",
      initials: "EO",
      avatarColor: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
      status: "active",
      activityDescription: (
        <>
          Reviewing PR #207 — <span className="font-semibold text-foreground">mobile app</span> onboarding flow
        </>
      ),
      tags: ["2 reviews done", "MRI-89", "No blockers"],
      actionText: "View review history ↗",
    },
  ],
  this_week: [
    {
      id: "status-w1",
      name: "Daniel Emeka",
      role: "Backend",
      initials: "DE",
      avatarColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      status: "active",
      activityDescription: (
        <>
          Shipped key endpoints for <span className="font-semibold text-foreground">Auth v2</span> and cleared database backlogs.
        </>
      ),
      tags: ["6 commits", "2 PRs merged"],
      actionText: "View weekly digest ↗",
    },
    {
      id: "status-w2",
      name: "Francis Anyeji",
      role: "Backend",
      initials: "FA",
      avatarColor: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
      status: "active",
      activityDescription: (
        <>
          Integrated <span className="font-semibold text-foreground">Stripe webhooks</span> and audited payment security.
        </>
      ),
      tags: ["Jira board updated", "3 pull requests"],
      actionText: "View ticket logs ↗",
    },
    {
      id: "status-w3",
      name: "Taofik Opeyemi",
      role: "Frontend",
      initials: "TO",
      avatarColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      status: "idle",
      activityDescription: (
        <>
          Completed initial UI design for <span className="font-semibold text-foreground">workspace switcher</span>.
        </>
      ),
      tags: ["Figma design complete"],
      actionText: "View Figma specs ↗",
    },
  ],
  sprint_12: [
    {
      id: "status-s1",
      name: "Daniel Emeka",
      role: "Backend",
      initials: "DE",
      avatarColor: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      status: "blocked",
      activityDescription: (
        <>
          Blocked by security signoff on <span className="font-semibold text-foreground">Auth migration plan</span>.
        </>
      ),
      tags: ["Jira MRI-88", "1 blocker"],
      actionText: "See block report ↗",
    },
    {
      id: "status-s2",
      name: "Enoch Oluwa",
      role: "Frontend",
      initials: "EO",
      avatarColor: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
      status: "active",
      activityDescription: (
        <>
          Shipped the <span className="font-semibold text-foreground">mobile onboarding flow v2</span> dashboard UI.
        </>
      ),
      tags: ["12 story points completed"],
      actionText: "See sprint breakdown ↗",
    },
  ],
};

/* ──────────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────────── */
export default function TeamActivityPage() {
  const [viewMode, setViewMode] = useState<"feed" | "status">("status"); // default to status first to showcase it!
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [statusPeriod, setStatusPeriod] = useState<"today" | "this_week" | "sprint_12">("today");

  const filtered = ACTIVITIES.filter((a) => {
    const types = tabFilter[activeTab];
    return !types || types.includes(a.type);
  });

  const groups = [
    { key: "today" as const, label: "Today" },
    { key: "yesterday" as const, label: "Yesterday" },
    { key: "this_week" as const, label: "Earlier This Week" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header + Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {viewMode === "feed" ? "Team Activity Feed" : "Team Focus & Status"}
          </h1>
          <p className="text-sm text-muted mt-1">
            {viewMode === "feed"
              ? "Chronological event logs from GitHub, Jira, Slack, and Calendar."
              : "Live active focus, blocker tracking, and status metrics per developer."}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl w-fit self-start md:self-auto">
          <button
            onClick={() => setViewMode("status")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none ${
              viewMode === "status"
                ? "bg-accent text-black font-semibold"
                : "bg-transparent text-muted hover:text-foreground"
            }`}
          >
            Team Status
          </button>
          <button
            onClick={() => setViewMode("feed")}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none ${
              viewMode === "feed"
                ? "bg-accent text-black font-semibold"
                : "bg-transparent text-muted hover:text-foreground"
            }`}
          >
            Activity Feed
          </button>
        </div>
      </div>

      {/* ── View 1: Feed mode ── */}
      {viewMode === "feed" && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none ${
                  activeTab === tab
                    ? "bg-surface-elevated text-foreground border border-border"
                    : "bg-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Activity timeline */}
          <div className="space-y-8">
            {groups.map((group) => {
              const items = filtered.filter((a) => a.group === group.key);
              if (items.length === 0) return null;
              return (
                <div key={group.key} className="space-y-3">
                  <h3 className="text-[11px] font-semibold text-muted-dark uppercase tracking-wider px-1">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface border border-transparent hover:border-border transition-all group"
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${item.user.color}`}
                        >
                          {item.user.initials}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground/90 leading-relaxed">
                            <span className="font-medium text-foreground">
                              {item.user.name}
                            </span>{" "}
                            {item.action}{" "}
                            <span className="text-accent font-medium">
                              {item.target}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="flex items-center gap-1.5 text-[11px] text-muted-dark">
                              <span className="opacity-70">
                                {sourceIcon[item.source]}
                              </span>
                              {sourceLabel[item.source]}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-muted-dark" />
                            <span className="text-[11px] text-muted-dark font-mono">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── View 2: Status mode ── */}
      {viewMode === "status" && (
        <div className="space-y-5">
          {/* Status Sub-filter */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Developer Active Status
            </h3>
            <div className="flex items-center gap-1 p-0.5 bg-surface border border-border rounded-xl">
              {(["today", "this_week", "sprint_12"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setStatusPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border-none ${
                    statusPeriod === period
                      ? "bg-surface-elevated text-foreground border border-border"
                      : "bg-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {period === "today" ? "Today" : period === "this_week" ? "This Week" : "Sprint 12"}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 gap-3.5">
            {STATUS_ITEMS[statusPeriod].map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-2xl p-4.5 transition-all hover:border-accent-border/40 relative flex flex-col sm:flex-row sm:items-start gap-4"
              >
                {/* Profile Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.avatarColor}`}
                >
                  {item.initials}
                </div>

                {/* Card Main Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-[14px] font-semibold text-foreground leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-muted">
                        {item.role}
                      </p>
                    </div>

                    {/* Pulsing Status Dot */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-dark uppercase tracking-wider">
                        {item.status === "active" ? "Active Now" : item.status === "idle" ? "Idle (2h)" : "Blocked"}
                      </span>
                      <span className="relative flex h-2 w-2">
                        {item.status === "active" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        {item.status === "idle" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        )}
                        {item.status === "blocked" && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          item.status === "active"
                            ? "bg-emerald-500"
                            : item.status === "idle"
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}></span>
                      </span>
                    </div>
                  </div>

                  {/* Active focus description */}
                  <p className="text-[13px] text-foreground/80 leading-relaxed">
                    {item.activityDescription}
                  </p>

                  {/* Badges/Tags list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-muted-dark bg-background/50 border border-border px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer links */}
                  <div className="pt-2 border-t border-border-subtle mt-3">
                    <a
                      href="#"
                      className="text-[11px] font-mono text-accent no-underline hover:underline hover:text-accent-hover transition-colors inline-block"
                    >
                      {item.actionText}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
