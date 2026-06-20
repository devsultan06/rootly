"use client";

import React, { useState } from "react";

/* ──────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────── */
type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string; // Dynamic role names supported!
  initials: string;
  color: string;
  status: "active" | "invited";
};

type RoleDefinition = {
  name: string;
  isCustom: boolean;
  description: string;
  permissions: {
    viewAnalytics: boolean;
    useAI: boolean;
    editProjects: boolean;
    manageIntegrations: boolean;
    manageAPIKeys: boolean;
  };
};

/* ──────────────────────────────────────────────
   INITIAL DATA
   ────────────────────────────────────────────── */
const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: "1", name: "Sultan C.", email: "sultan@rootly.io", role: "Admin", initials: "SC", color: "bg-accent/20 text-accent border border-accent-border/30", status: "active" },
  { id: "2", name: "Amara K.", email: "amara@rootly.io", role: "Member", initials: "AK", color: "bg-teal-500/20 text-teal-400 border border-teal-500/30", status: "active" },
  { id: "3", name: "Raj P.", email: "raj@rootly.io", role: "Member", initials: "RP", color: "bg-blue-500/20 text-blue-400 border border-blue-500/30", status: "active" },
  { id: "4", name: "Luna C.", email: "luna@rootly.io", role: "Member", initials: "LC", color: "bg-purple-500/20 text-purple-400 border border-purple-500/30", status: "active" },
  { id: "5", name: "Omar T.", email: "omar@rootly.io", role: "Member", initials: "OT", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30", status: "active" },
  { id: "6", name: "Priya S.", email: "priya@rootly.io", role: "Viewer", initials: "PS", color: "bg-pink-500/20 text-pink-400 border border-pink-500/30", status: "invited" },
];

const DEFAULT_ROLES: RoleDefinition[] = [
  {
    name: "Admin",
    isCustom: false,
    description: "Full administrator control with access to all settings, credentials, and integrations.",
    permissions: { viewAnalytics: true, useAI: true, editProjects: true, manageIntegrations: true, manageAPIKeys: true },
  },
  {
    name: "Member",
    isCustom: false,
    description: "Standard developer access. Can edit projects, use AI chat features, and view statistics.",
    permissions: { viewAnalytics: true, useAI: true, editProjects: true, manageIntegrations: false, manageAPIKeys: false },
  },
  {
    name: "Viewer",
    isCustom: false,
    description: "Observer access. Read-only permissions across all dashboard analytics and reports.",
    permissions: { viewAnalytics: true, useAI: false, editProjects: false, manageIntegrations: false, manageAPIKeys: false },
  },
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
  const [activeSection, setActiveSection] = useState<Section>("Team");
  const [teamSubTab, setTeamSubTab] = useState<"members" | "permissions">("permissions"); // Default to permissions sub-tab to show updates!
  
  const [notifications, setNotifications] = useState(
    NOTIFICATION_SETTINGS.map((n) => ({ ...n })),
  );

  // States for Roles & Dynamic Permissions
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_ROLES);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("Member");
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");

  // States for Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("Member");
  const [teamSearch, setTeamSearch] = useState("");

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

  // Add a new Dynamic Custom Role
  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    if (roles.some((r) => r.name.toLowerCase() === newRoleName.trim().toLowerCase())) {
      alert("A role with this name already exists.");
      return;
    }

    const newRole: RoleDefinition = {
      name: newRoleName.trim(),
      isCustom: true,
      description: newRoleDescription.trim() || "Custom project-defined role.",
      permissions: {
        viewAnalytics: true,
        useAI: false,
        editProjects: false,
        manageIntegrations: false,
        manageAPIKeys: false,
      },
    };

    setRoles((prev) => [...prev, newRole]);
    setSelectedRoleName(newRole.name);
    setNewRoleName("");
    setNewRoleDescription("");
    setIsCreateRoleOpen(false);
  };

  // Check/Uncheck permissions for custom roles
  const handleTogglePermission = (roleName: string, permissionKey: keyof RoleDefinition["permissions"]) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.name === roleName && r.isCustom) {
          return {
            ...r,
            permissions: {
              ...r.permissions,
              [permissionKey]: !r.permissions[permissionKey],
            },
          };
        }
        return r;
      })
    );
  };

  // Delete a Custom Role
  const handleDeleteRole = (roleName: string) => {
    if (confirm(`Are you sure you want to delete the role "${roleName}"? Any members with this role will default back to "Member".`)) {
      setRoles((prev) => prev.filter((r) => r.name !== roleName));
      setTeamMembers((prev) =>
        prev.map((m) => (m.role === roleName ? { ...m, role: "Member" } : m))
      );
      setSelectedRoleName("Member");
    }
  };

  // Invite user to dynamic roles
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    const initials = inviteName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    const colors = [
      "bg-teal-500/20 text-teal-400 border border-teal-500/30",
      "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      initials: initials || "U",
      color: randomColor,
      status: "invited",
    };

    setTeamMembers((prev) => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Member");
    setIsInviteModalOpen(false);
  };

  // Change member role inline
  const handleChangeRole = (id: string, role: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  // Revoke/Delete member
  const handleRemoveMember = (id: string) => {
    if (id === "1") {
      alert("You cannot remove yourself (the organization Owner).");
      return;
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const selectedRole = roles.find((r) => r.name === selectedRoleName) || roles[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your account, team roles, and API configurations.
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
                ? "bg-accent text-black font-semibold"
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
            <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent-border/30 flex items-center justify-center text-accent text-xl font-bold">
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

      {/* ── Team (Interactive Members + Custom Roles) ── */}
      {activeSection === "Team" && (
        <div className="space-y-6 max-w-5xl">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-4 border-b border-border/40 pb-1">
            <button
              onClick={() => setTeamSubTab("members")}
              className={`pb-2.5 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer relative ${
                teamSubTab === "members" ? "text-accent font-semibold" : "text-muted hover:text-foreground"
              }`}
            >
              Members list
              {teamSubTab === "members" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTeamSubTab("permissions")}
              className={`pb-2.5 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer relative ${
                teamSubTab === "permissions" ? "text-accent font-semibold" : "text-muted hover:text-foreground"
              }`}
            >
              Roles & Permissions
              {teamSubTab === "permissions" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          </div>

          {/* Sub-tab 1: MEMBERS LIST */}
          {teamSubTab === "members" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-72 bg-surface border border-border rounded-xl px-3 py-1.5 focus-within:border-accent-border transition-colors">
                  <span className="text-muted-dark">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21L16.5 16.5" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search members by name or email..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs text-foreground placeholder-muted-dark flex-1"
                  />
                </div>

                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-black hover:bg-accent-hover transition-all cursor-pointer border-none flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Invite Member
                </button>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_120px_80px_40px] gap-4 px-5 py-3.5 border-b border-border text-[10px] font-semibold text-muted-dark uppercase tracking-wider items-center">
                  <span>Member</span>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                {/* Rows */}
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-[1fr_1fr_120px_80px_40px] gap-4 px-5 py-3.5 border-b border-border-subtle hover:bg-surface-hover/30 transition-colors items-center"
                    >
                      {/* Name column */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${member.color}`}
                        >
                          {member.initials}
                        </div>
                        <span className="text-sm font-medium text-foreground truncate">
                          {member.name}
                        </span>
                      </div>

                      {/* Email column */}
                      <span className="text-xs text-muted truncate">
                        {member.email}
                      </span>

                      {/* Dynamic Role selection dropdown */}
                      <div>
                        {member.id === "1" ? (
                          <span className="text-[11px] font-semibold text-accent bg-accent-muted border border-accent-border/20 px-2.5 py-1 rounded-md">
                            Owner
                          </span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value)}
                            className="bg-background text-xs text-foreground border border-border rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-accent-border transition-colors w-28"
                          >
                            {roles.map((r) => (
                              <option key={r.name} value={r.name}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Status indicator */}
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === "active" ? "bg-success" : "bg-warning"
                          }`}
                        />
                        <span className="text-[11px] text-muted capitalize">
                          {member.status}
                        </span>
                      </span>

                      {/* Revoke/Delete action button */}
                      <div className="text-right">
                        {member.id !== "1" ? (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-muted hover:text-danger bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-danger/10 transition-all"
                            title={member.status === "invited" ? "Revoke Invite" : "Remove Member"}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-xs text-muted-dark font-mono pr-2">—</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-muted-dark">No members found matching your search.</div>
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 2: ROLES & GRANULAR PERMISSIONS BUILDER */}
          {teamSubTab === "permissions" && (
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
              {/* Left Column: Roles list */}
              <div className="bg-surface border border-border rounded-xl p-4.5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Defined Roles
                  </h4>
                  <button
                    onClick={() => setIsCreateRoleOpen(true)}
                    className="text-xs text-accent font-semibold bg-transparent border-none cursor-pointer hover:text-accent-hover transition-colors"
                  >
                    + Create custom
                  </button>
                </div>

                <div className="space-y-1">
                  {roles.map((role) => (
                    <button
                      key={role.name}
                      onClick={() => setSelectedRoleName(role.name)}
                      className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1 ${
                        selectedRoleName === role.name
                          ? "bg-accent-muted border-accent-border text-foreground"
                          : "bg-transparent border-transparent text-muted hover:text-foreground hover:bg-surface-hover/30"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[13px] font-semibold">{role.name}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                          role.isCustom
                            ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                            : "bg-surface-elevated text-muted border border-border"
                        }`}>
                          {role.isCustom ? "Custom" : "Template"}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-dark line-clamp-1">
                        {role.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Checklist details */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/40">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-semibold text-foreground">
                        {selectedRole.name} Role Details
                      </h3>
                      {selectedRole.isCustom && (
                        <span className="text-[9px] font-bold uppercase bg-pink-500/10 text-pink-400 border border-pink-500/25 px-2 py-0.5 rounded">
                          Custom permissions
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {selectedRole.description}
                    </p>
                  </div>

                  {selectedRole.isCustom && (
                    <button
                      onClick={() => handleDeleteRole(selectedRole.name)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-danger-muted text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all cursor-pointer"
                    >
                      Delete Custom Role
                    </button>
                  )}
                </div>

                {/* Granular Permission Checklist */}
                <div className="space-y-4 pt-1">
                  <h4 className="text-xs font-bold text-muted-dark uppercase tracking-wider">
                    Permissions Setup
                  </h4>

                  <div className="space-y-3.5">
                    {/* View Analytics */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border border-border-subtle ${
                      selectedRole.isCustom ? "cursor-pointer hover:border-accent-border/30" : "cursor-default opacity-85"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.viewAnalytics}
                        disabled={!selectedRole.isCustom}
                        onChange={() => handleTogglePermission(selectedRole.name, "viewAnalytics")}
                        className="mt-0.5 rounded accent-accent h-4 w-4"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          View Analytics & Metrics
                          {!selectedRole.isCustom && (
                            <span className="text-[10px] text-muted-dark font-normal">🔒 Locked</span>
                          )}
                        </h5>
                        <p className="text-[11px] text-muted mt-0.5 leading-normal">
                          Allows accessing dashboard landing widgets, health scores, sprint trends, and the chronological Team Activity event logs.
                        </p>
                      </div>
                    </label>

                    {/* Ask AI */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border border-border-subtle ${
                      selectedRole.isCustom ? "cursor-pointer hover:border-accent-border/30" : "cursor-default opacity-85"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.useAI}
                        disabled={!selectedRole.isCustom}
                        onChange={() => handleTogglePermission(selectedRole.name, "useAI")}
                        className="mt-0.5 rounded accent-accent h-4 w-4"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          Query Ask AI Chat & Standups
                          {!selectedRole.isCustom && (
                            <span className="text-[10px] text-muted-dark font-normal">🔒 Locked</span>
                          )}
                        </h5>
                        <p className="text-[11px] text-muted mt-0.5 leading-normal">
                          Access the company AI chat system, prompt history logs, and trigger quick actions (Generate Standup, Find Blockers, Summarize Sprint).
                        </p>
                      </div>
                    </label>

                    {/* Edit Projects */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border border-border-subtle ${
                      selectedRole.isCustom ? "cursor-pointer hover:border-accent-border/30" : "cursor-default opacity-85"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.editProjects}
                        disabled={!selectedRole.isCustom}
                        onChange={() => handleTogglePermission(selectedRole.name, "editProjects")}
                        className="mt-0.5 rounded accent-accent h-4 w-4"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          Create & Edit Projects
                          {!selectedRole.isCustom && (
                            <span className="text-[10px] text-muted-dark font-normal">🔒 Locked</span>
                          )}
                        </h5>
                        <p className="text-[11px] text-muted mt-0.5 leading-normal">
                          Allows adding new services in project grids, updating backlog milestones, modifying ticket priorities, and reading project drill-down summaries.
                        </p>
                      </div>
                    </label>

                    {/* Manage Integrations */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border border-border-subtle ${
                      selectedRole.isCustom ? "cursor-pointer hover:border-accent-border/30" : "cursor-default opacity-85"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.manageIntegrations}
                        disabled={!selectedRole.isCustom}
                        onChange={() => handleTogglePermission(selectedRole.name, "manageIntegrations")}
                        className="mt-0.5 rounded accent-accent h-4 w-4"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          Manage Workspaces & Integrations
                          {!selectedRole.isCustom && (
                            <span className="text-[10px] text-muted-dark font-normal">🔒 Locked</span>
                          )}
                        </h5>
                        <p className="text-[11px] text-muted mt-0.5 leading-normal">
                          Allows connecting or disconnecting Jira workspaces, GitHub code repos, Slack channels, and managing oauth hooks.
                        </p>
                      </div>
                    </label>

                    {/* Manage API Keys */}
                    <label className={`flex items-start gap-3 p-3 rounded-xl border border-border-subtle ${
                      selectedRole.isCustom ? "cursor-pointer hover:border-accent-border/30" : "cursor-default opacity-85"
                    }`}>
                      <input
                        type="checkbox"
                        checked={selectedRole.permissions.manageAPIKeys}
                        disabled={!selectedRole.isCustom}
                        onChange={() => handleTogglePermission(selectedRole.name, "manageAPIKeys")}
                        className="mt-0.5 rounded accent-accent h-4 w-4"
                      />
                      <div>
                        <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          Manage live API Keys
                          {!selectedRole.isCustom && (
                            <span className="text-[10px] text-muted-dark font-normal">🔒 Locked</span>
                          )}
                        </h5>
                        <p className="text-[11px] text-muted mt-0.5 leading-normal">
                          Allows creating, viewing, copying, or regenerating API secret keys used to pull data outside of Rootly.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {!selectedRole.isCustom && (
                  <p className="text-[10px] text-muted-dark italic pt-1">
                    * Locked template roles cannot be modified to ensure standard team hierarchy defaults. Create a custom role to customize permissions.
                  </p>
                )}
              </div>
            </div>
          )}
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

      {/* ── Invite Member Modal ── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl animate-fade-in text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-base font-semibold text-foreground">
                Invite Team Member
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-muted hover:text-foreground bg-transparent border-none cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniel Emeka"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-surface-elevated border border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@rootly.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-surface-elevated border border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Role Permission
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-surface-elevated border border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none transition-colors cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-elevated text-muted hover:text-foreground transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-black hover:bg-accent-hover transition-colors border-none cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Custom Role Modal ── */}
      {isCreateRoleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl animate-fade-in text-left">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <h3 className="text-base font-semibold text-foreground">
                Create Custom Role
              </h3>
              <button
                onClick={() => setIsCreateRoleOpen(false)}
                className="text-muted hover:text-foreground bg-transparent border-none cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Role Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Release Manager"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full bg-surface-elevated border border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe the scope of this role..."
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full bg-surface-elevated border border-border focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-elevated text-muted hover:text-foreground transition-colors border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-accent text-black hover:bg-accent-hover transition-colors border-none cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
