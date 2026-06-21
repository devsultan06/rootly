"use client";

import React, { useState, useEffect } from "react";
import { DashboardIcons } from "../components/DashboardIcons";
import { supabase } from "../../../lib/supabase";


/* ──────────────────────────────────────────────
   TYPES
   ────────────────────────────────────────────── */
type Commit = {
  id: string;
  hash: string;
  message: string;
  author: string;
  time: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  status: "on_track" | "at_risk" | "behind";
  github_repo: string | null;
  commits: Commit[];
  // Mocked aesthetic details
  progress?: number;
  sprint?: { name: string; daysLeft: number; velocity: number };
  team?: { initials: string; color: string }[];
  openPRs?: number;
  blockers?: number;
};

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

// Default team styles for mock assignments
const TEAMS_POOL = [
  [
    { initials: "RP", color: "bg-blue-500/20 text-blue-400" },
    { initials: "AK", color: "bg-teal-500/20 text-teal-400" },
    { initials: "OT", color: "bg-orange-500/20 text-orange-400" },
  ],
  [
    { initials: "LC", color: "bg-purple-500/20 text-purple-400" },
    { initials: "PS", color: "bg-pink-500/20 text-pink-400" },
  ],
  [
    { initials: "OT", color: "bg-orange-500/20 text-orange-400" },
    { initials: "AK", color: "bg-teal-500/20 text-teal-400" },
  ],
];

/* ──────────────────────────────────────────────
   PROJECTS PAGE COMPONENT
   ────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [jiraTab, setJiraTab] = useState<"in_progress" | "review" | "blocked">("in_progress");
  const [periodFilter, setPeriodFilter] = useState<"today" | "this_week" | "sprint_12">("today");

  // Create Project Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectRepo, setProjectRepo] = useState("");
  const [projectStatus, setProjectStatus] = useState<"on_track" | "at_risk" | "behind">("on_track");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // Fetch token and project list
  useEffect(() => {
    const fetchSessionAndProjects = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setToken(session.access_token);
          await loadProjects(session.access_token);
        }
      } catch (err) {
        console.error("Session error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProjects();
  }, []);

  const loadProjects = async (accessToken: string) => {
    try {
      const res = await fetch(`${backendUrl}/projects`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        
        // Enrich backend project rows with beautiful UI metrics
        const enriched = data.map((p: any, idx: number) => ({
          ...p,
          progress: p.progress || Math.floor(Math.random() * 50) + 40, // 40-90%
          sprint: { name: "Sprint 24", daysLeft: 3, velocity: Math.floor(Math.random() * 30) + 70 },
          team: TEAMS_POOL[idx % TEAMS_POOL.length],
          openPRs: p.github_repo ? Math.floor(Math.random() * 4) + 1 : 0,
          blockers: p.status === "behind" ? 2 : p.status === "at_risk" ? 1 : 0,
        }));
        
        setProjects(enriched);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setSaving(true);

    try {
      const res = await fetch(`${backendUrl}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDesc,
          github_repo: projectRepo.trim() !== "" ? projectRepo : undefined,
          status: projectStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project.");
      }

      // If github_repo was supplied, automatically trigger a backend sync to pull commits
      if (projectRepo.trim() !== "") {
        try {
          await fetch(`${backendUrl}/integrations/github/sync`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          console.warn("Auto-sync failed on project creation:", err);
        }
      }

      setProjectName("");
      setProjectDesc("");
      setProjectRepo("");
      setProjectStatus("on_track");
      setIsModalOpen(false);
      
      if (token) await loadProjects(token);
    } catch (err: any) {
      setModalError(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const formatCommitTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hr ago";
    if (diffHours < 24) return `${diffHours} hrs ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-accent/25 border-t-accent rounded-full animate-spin mb-3" />
        <p className="text-xs text-muted">Loading projects...</p>
      </div>
    );
  }

  // If a project is selected, render the detail view
  if (selectedProjectId) {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (!project) return null;

    const sc = statusConfig[project.status];
    const commits = project.commits || [];

    // Mock Jira tickets for detail view (keeping mock layout complete)
    const jiraTickets = [
      { id: "MRI-88", title: "Refactor JWT middleware to support refresh tokens", status: "Doing", tab: "in_progress" },
      { id: "MRI-91", title: "Add rate limiting to /auth/login endpoint", status: "Doing", tab: "in_progress" },
      { id: "MRI-85", title: "OAuth2 Google login integration", status: "Review", tab: "review" },
      { id: "MRI-79", title: "Fix token expiry race condition on mobile", status: "Blocked", tab: "blocked" },
    ].filter((t) => t.tab === jiraTab);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button & Header */}
        <div>
          <button
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0 mb-4 font-sans"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Projects
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {project.name} — Project view
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
                  {project.name}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sc.cls}`}>
                  {sc.label}
                </span>
              </div>
              <p className="text-xs text-muted mt-1.5 font-medium">
                {project.github_repo ? `GitHub repo: ${project.github_repo}` : "No repository linked"}
              </p>
            </div>
          </div>

          {/* Quick Metrics Numbers */}
          <div className="grid grid-cols-4 gap-2 md:gap-6 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">0</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">Failed deploys</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{project.status === "behind" ? 7 : 4}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">Open tickets</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{project.openPRs || 0}</p>
              <p className="text-[10px] text-muted-dark font-medium mt-0.5 uppercase tracking-wider">PRs open</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-lg md:text-xl font-semibold text-foreground tracking-tight">{project.blockers || 0}</p>
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
                Jira tickets (Mocked)
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
              {jiraTickets.length > 0 ? (
                jiraTickets.map((ticket) => (
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
                <p className="text-xs text-muted-dark text-center py-6 font-sans">No tickets in this state.</p>
              )}
            </div>
          </div>

          {/* Recent Commits Panel */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="text-accent">{DashboardIcons.github}</span>
              Recent commits (GitHub)
            </h3>

            {/* Commits List */}
            <div className="space-y-4 pt-1">
              {commits.length > 0 ? (
                commits.map((c, i) => (
                  <div key={c.id || i} className="flex items-start justify-between gap-3 px-1">
                    <div className="min-w-0">
                      <a
                        href={project.github_repo ? `https://github.com/${project.github_repo}/commit/${c.hash}` : "#"}
                        target={project.github_repo ? "_blank" : undefined}
                        rel="noreferrer"
                        className="text-[13px] text-foreground/90 font-medium leading-normal hover:text-accent transition-colors truncate block no-underline"
                      >
                        {c.message}
                      </a>
                      <p className="text-[11px] text-muted-dark mt-1 font-medium font-sans">
                        <span className="text-muted">{c.author}</span>
                        {" · "}{formatCommitTime(c.time)}
                      </p>
                    </div>
                    <a
                      href={project.github_repo ? `https://github.com/${project.github_repo}/commit/${c.hash}` : "#"}
                      target={project.github_repo ? "_blank" : undefined}
                      rel="noreferrer"
                      className="text-[10px] font-mono text-accent bg-accent-muted border border-accent-border/20 px-2 py-0.5 rounded-md flex-shrink-0 hover:border-accent/40 transition-colors no-underline"
                    >
                      #{c.hash}
                    </a>
                  </div>
                ))

              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-dark font-sans">No commits synced yet.</p>
                  {project.github_repo && (
                    <p className="text-[10px] text-muted mt-1 font-sans">
                      Go to Integrations to trigger an active sync.
                    </p>
                  )}
                </div>
              )}

              {commits.length > 0 && project.github_repo && (
                <div className="pt-3 border-t border-border/30 flex justify-end">
                  <a
                    href={`https://github.com/${project.github_repo}/commits`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-accent hover:underline flex items-center gap-1 font-sans font-medium"
                  >
                    View all commits on GitHub →
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted mt-1">
            {projects.length} active projects across your engineering teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Project Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-accent hover:bg-teal-400 active:scale-[0.98] text-black font-semibold text-xs rounded-md transition-all cursor-pointer border-none flex items-center gap-1.5 font-sans"
          >
            <span>+</span> Add Project
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 py-2 w-full sm:w-60 focus-within:border-accent-border transition-colors">
            <span className="text-muted-dark">{DashboardIcons.search}</span>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder-muted-dark flex-1 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {filtered.length > 0 ? (
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
                      {project.description || "No description provided."}
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
                      {project.sprint?.name} · {project.sprint?.daysLeft}d left
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
                    {project.team?.map((member, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-surface ${member.color}`}
                      >
                        {member.initials}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 font-sans">
                    <span className="flex items-center gap-1 text-[11px] text-muted-dark">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9" />
                      </svg>
                      {project.openPRs} PRs
                    </span>
                    {project.blockers && project.blockers > 0 ? (
                      <span className="flex items-center gap-1 text-[11px] text-danger">
                        ⚠ {project.blockers} blocker{project.blockers > 1 ? "s" : ""}
                      </span>
                    ) : null}
                    <span className="text-[11px] text-muted-dark font-mono">
                      vel: {project.sprint?.velocity}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="text-sm text-muted font-sans">No projects found.</p>
          <p className="text-xs text-muted-dark mt-1 font-sans">Click Add Project to create one.</p>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Create Project</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalError("");
                }}
                className="text-muted hover:text-foreground bg-transparent border-none cursor-pointer text-lg font-sans"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 text-xs bg-danger/10 text-danger border border-danger/25 rounded-lg font-sans">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Core API Service"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  disabled={saving}
                  required
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-accent-border focus:ring-1 focus:ring-accent-border/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe this project's purpose..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  disabled={saving}
                  rows={2}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-accent-border focus:ring-1 focus:ring-accent-border/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all font-sans resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  GitHub Repository (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. facebook/react"
                  value={projectRepo}
                  onChange={(e) => setProjectRepo(e.target.value)}
                  disabled={saving}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-accent-border focus:ring-1 focus:ring-accent-border/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all font-sans"
                />
                <p className="text-[10px] text-muted-dark mt-1 font-sans">
                  Format: organization/repository-name
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value as any)}
                  disabled={saving}
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-accent-border rounded-lg py-2.5 px-3.5 text-xs text-foreground outline-none transition-all font-sans"
                >
                  <option value="on_track">On Track</option>
                  <option value="at_risk">At Risk</option>
                  <option value="behind">Behind</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-transparent border border-border rounded-lg transition-colors cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold bg-accent hover:bg-teal-400 active:scale-[0.98] text-black rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  {saving ? "Creating..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
