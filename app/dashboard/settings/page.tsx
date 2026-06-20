"use client";

import React, { useState } from "react";

/* ──────────────────────────────────────────────
   MOCK DATA
   ────────────────────────────────────────────── */
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Viewer";
  initials: string;
  color: string;
  status: "active" | "invited";
};

const TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Sultan C.", email: "sultan@rootly.io", role: "Admin", initials: "SC", color: "bg-accent/20 text-accent", status: "active" },
  { id: "2", name: "Amara K.", email: "amara@rootly.io", role: "Member", initials: "AK", color: "bg-teal-500/20 text-teal-400", status: "active" },
  { id: "3", name: "Raj P.", email: "raj@rootly.io", role: "Member", initials: "RP", color: "bg-blue-500/20 text-blue-400", status: "active" },
  { id: "4", name: "Luna C.", email: "luna@rootly.io", role: "Member", initials: "LC", color: "bg-purple-500/20 text-purple-400", status: "active" },
  { id: "5", name: "Omar T.", email: "omar@rootly.io", role: "Member", initials: "OT", color: "bg-orange-500/20 text-orange-400", status: "active" },
  { id: "6", name: "Priya S.", email: "priya@rootly.io", role: "Viewer", initials: "PS", color: "bg-pink-500/20 text-pink-400", status: "invited" },
];

const NOTIFICATION_SETTINGS = [
  { id: "daily_digest", label: "Daily Digest Email", description: "Receive a daily summary of your team's activity.", enabled: true },
  { id: "risk_alerts", label: "Risk Alerts", description: "Get notified when blockers or risks are detected.", enabled: true },
  { id: "pr_updates", label: "PR Activity", description: "Notifications when PRs need your review or are merged.", enabled: false },
  { id: "standup_reminder", label: "Standup Reminders", description: "Daily reminder to review standup summaries.", enabled: true },
  { id: "slack_notifications", label: "Slack Notifications", description: "Push key updates to your Slack workspace.", enabled: false },
];

const SECTIONS = ["Profile", "Notifications", "Team", "API Keys"] as const;
type Section = (typeof SECTIONS)[number];

/* ──────────────────────────────────────────────
   SETTINGS PAGE
   ────────────────────────────────────────────── */
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("Profile");
  const [notifications, setNotifications] = useState(
    NOTIFICATION_SETTINGS.map((n) => ({ ...n })),
  );
  const [copied, setCopied] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const apiKey = "rtly_sk_1a2b3c4d5e6f7g8h9i0j_live";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your account, team, and preferences.
        </p>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl w-fit overflow-x-auto">
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${
              activeSection === section
                ? "bg-accent text-black"
                : "bg-transparent text-muted hover:text-foreground"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* ── Profile ── */}
      {activeSection === "Profile" && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-6 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent-border flex items-center justify-center text-accent text-xl font-bold">
              SC
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Sultan C.
              </h3>
              <p className="text-xs text-muted-dark">sultan@rootly.io</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { label: "Full Name", value: "Sultan C.", id: "name" },
              { label: "Email", value: "sultan@rootly.io", id: "email" },
              { label: "Company", value: "Rootly Inc.", id: "company" },
              { label: "Role", value: "Engineering Lead", id: "role" },
            ].map((field) => (
              <div key={field.id}>
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  defaultValue={field.value}
                  className="w-full bg-surface-elevated border border-border hover:border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-sm text-foreground outline-none transition-all"
                />
              </div>
            ))}
          </div>

          <button className="px-5 py-2 rounded-lg text-xs font-semibold bg-accent text-black hover:bg-accent-hover transition-all cursor-pointer border-none">
            Save Changes
          </button>
        </div>
      )}

      {/* ── Notifications ── */}
      {activeSection === "Notifications" && (
        <div className="bg-surface border border-border rounded-xl divide-y divide-border max-w-2xl">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between p-5 gap-4"
            >
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {n.label}
                </h4>
                <p className="text-xs text-muted mt-0.5">{n.description}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => toggleNotification(n.id)}
                className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer border-none flex-shrink-0 ${
                  n.enabled ? "bg-accent" : "bg-surface-elevated border border-border"
                }`}
              >
                <span
                  className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                    n.enabled ? "left-[22px]" : "left-[3px]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Team ── */}
      {activeSection === "Team" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              {TEAM_MEMBERS.length} members
            </p>
            <button className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-accent/10 text-accent border border-accent-border hover:bg-accent hover:text-black transition-all cursor-pointer">
              Invite Member
            </button>
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-5 py-3 border-b border-border text-[10px] font-semibold text-muted-dark uppercase tracking-wider">
              <span>Member</span>
              <span>Email</span>
              <span>Role</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-5 py-3.5 border-b border-border-subtle hover:bg-surface-hover transition-colors items-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${member.color}`}
                  >
                    {member.initials}
                  </div>
                  <span className="text-sm text-foreground truncate">
                    {member.name}
                  </span>
                </div>
                <span className="text-xs text-muted truncate">
                  {member.email}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md w-fit ${
                    member.role === "Admin"
                      ? "bg-accent-muted text-accent"
                      : member.role === "Member"
                      ? "bg-surface-elevated text-muted"
                      : "bg-surface-elevated text-muted-dark"
                  }`}
                >
                  {member.role}
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      member.status === "active"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  />
                  <span className="text-[11px] text-muted capitalize">
                    {member.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── API Keys ── */}
      {activeSection === "API Keys" && (
        <div className="space-y-4 max-w-2xl">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Live API Key
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Use this key to authenticate API requests. Keep it secret.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-surface-elevated border border-border rounded-lg py-2.5 px-3.5 font-mono text-xs text-muted select-all overflow-x-auto">
                {apiKey}
              </div>
              <button
                onClick={handleCopy}
                className={`flex-shrink-0 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  copied
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-surface-elevated text-muted border-border hover:text-foreground hover:border-accent-border"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-danger-muted text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all cursor-pointer">
                Regenerate Key
              </button>
              <span className="text-[10px] text-muted-dark font-mono">
                Last used: 2 hours ago
              </span>
            </div>
          </div>

          {/* Usage docs hint */}
          <div className="bg-surface border border-border rounded-xl p-5 flex items-start gap-3">
            <span className="text-accent text-lg">📖</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">
                API Documentation
              </h4>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                Learn how to use the Rootly API to query your engineering data
                programmatically. All endpoints support pagination and
                filtering.
              </p>
              <button className="text-xs text-accent font-medium mt-2 bg-transparent border-none cursor-pointer hover:text-accent-hover transition-colors p-0">
                View docs →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
