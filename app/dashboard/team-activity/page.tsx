"use client";

import React, { useState } from "react";
import { DashboardIcons } from "../components/DashboardIcons";

/* ──────────────────────────────────────────────
   MOCK DATA
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
   TEAM ACTIVITY PAGE
   ────────────────────────────────────────────── */
export default function TeamActivityPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");

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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Team Activity
        </h1>
        <p className="text-sm text-muted mt-1">
          Real-time feed from GitHub, Jira, Slack, and Calendar.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none ${
              activeTab === tab
                ? "bg-accent text-black"
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
            <div key={group.key}>
              <h3 className="text-[11px] font-semibold text-muted-dark uppercase tracking-wider mb-3 px-1">
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
  );
}
