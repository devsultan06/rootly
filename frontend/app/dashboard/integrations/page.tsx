"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";


/* ──────────────────────────────────────────────
   TYPES & CATEGORIES
   ────────────────────────────────────────────── */
type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "development" | "communication" | "project_management";
};

const CATEGORIES = [
  { key: "development" as const, label: "Development" },
  { key: "communication" as const, label: "Communication" },
  { key: "project_management" as const, label: "Project Management" },
];

/* ──────────────────────────────────────────────
   INTEGRATIONS PAGE
   ────────────────────────────────────────────── */
export default function IntegrationsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeIntegrations, setActiveIntegrations] = useState<{ provider: string; last_sync?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // GitHub Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [githubPat, setGithubPat] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Syncing states
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  // Fetch token and active integrations
  useEffect(() => {
    const fetchSessionAndIntegrations = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setToken(session.access_token);
          await loadIntegrations(session.access_token);
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndIntegrations();
  }, []);

  const loadIntegrations = async (accessToken: string) => {
    try {
      const res = await fetch(`${backendUrl}/integrations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setActiveIntegrations(data);
      }
    } catch (err) {
      console.error("Failed to load active integrations:", err);
    }
  };

  const handleConnectGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setConnecting(true);

    try {
      const res = await fetch(`${backendUrl}/integrations/github/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: githubPat }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to connect to GitHub.");
      }

      setSuccessMsg("GitHub connected successfully!");
      setGithubPat("");
      if (token) await loadIntegrations(token);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async (provider: string) => {
    setSyncingProvider(provider);
    setSyncResult(null);

    try {
      const res = await fetch(`${backendUrl}/integrations/${provider}/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to sync ${provider}.`);
      }

      setSyncResult(data.message || `${provider} synchronized successfully.`);
      if (token) await loadIntegrations(token);
    } catch (err: any) {
      setSyncResult(`Sync failed: ${err.message}`);
    } finally {
      setSyncingProvider(null);
      setTimeout(() => setSyncResult(null), 4000);
    }
  };

  const handleDisconnect = async (provider: string) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;

    try {
      const res = await fetch(`${backendUrl}/integrations/${provider}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        if (token) await loadIntegrations(token);
      } else {
        const data = await res.json();
        alert(data.message || `Failed to disconnect ${provider}.`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to disconnect integration.");
    }
  };

  const isConnected = (providerId: string) => {
    return activeIntegrations.some((i) => i.provider === providerId);
  };

  const getLastSyncTime = (providerId: string) => {
    const integration = activeIntegrations.find((i) => i.provider === providerId);
    if (!integration?.last_sync) return "Never";
    
    const date = new Date(integration.last_sync);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hr ago";
    if (diffHours < 24) return `${diffHours} hrs ago`;
    
    return date.toLocaleDateString();
  };

  const INTEGRATIONS: Integration[] = [
    {
      id: "github",
      name: "GitHub",
      description: "Repositories, pull requests, commits, and code reviews.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
      category: "development",
    },
    {
      id: "jira",
      name: "Jira",
      description: "Tickets, sprints, boards, and backlog management.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#2684FF">
          <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24.013 12.487V1.005A1.005 1.005 0 0 0 23.013 0z" />
        </svg>
      ),
      category: "project_management",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Channels, direct messages, threads, and shared files.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
          <path fill="#E01E5A" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
          <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" />
          <path fill="#36C5F0" d="M8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
          <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" />
          <path fill="#2EB67D" d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
          <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" />
          <path fill="#ECB22E" d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
        </svg>
      ),
      category: "communication",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Meetings, standups, and calendar events for your team.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2V6M8 2V6M3 10H21M8 14H10M14 14H16M8 18H10" />
        </svg>
      ),
      category: "communication",
    },
    {
      id: "linear",
      name: "Linear",
      description: "Issues, cycles, projects, and roadmaps.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.03 15.674a11.997 11.997 0 0 0 6.296 6.296l9.349-9.349a.999.999 0 0 0 0-1.414L10.738 4.27a.999.999 0 0 0-1.414 0L2.03 15.674z" />
        </svg>
      ),
      category: "project_management",
    },
    {
      id: "confluence",
      name: "Confluence",
      description: "Documentation, wikis, and knowledge base articles.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#2684FF">
          <path d="M1.26 17.65c-.27.42-.55.88-.78 1.25a.84.84 0 0 0 .3 1.15l4.36 2.66a.84.84 0 0 0 1.15-.27c.2-.34.47-.78.78-1.27 2.2-3.48 4.37-3.05 8.3-1.17l4.44 2.13a.84.84 0 0 0 1.12-.38l2.36-5.06a.84.84 0 0 0-.38-1.12c-1.14-.54-3.4-1.62-5.55-2.65-6.24-2.96-11.35-2.7-16.1 4.73z" />
          <path d="M22.74 6.35c.27-.42.55-.88.78-1.25a.84.84 0 0 0-.3-1.15L18.86 1.29a.84.84 0 0 0-1.15.27c-.2.34-.47.78-.78 1.27-2.2 3.48-4.37 3.05-8.3 1.17L4.19 1.87a.84.84 0 0 0-1.12.38L.71 7.31a.84.84 0 0 0 .38 1.12c1.14.54 3.4 1.62 5.55 2.65 6.24 2.96 11.35 2.7 16.1-4.73z" />
        </svg>
      ),
      category: "project_management",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Docs, notes, databases, and team wikis.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.1 2.112c-.467-.373-.745-.466-1.306-.42L3.573 2.86c-.467.047-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.886c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.606.327-1.166.514-1.633.514-.746 0-.933-.234-1.493-.934l-4.571-7.186v6.952l1.446.327s0 .84-1.166.84l-3.22.186c-.093-.187 0-.654.327-.748l.84-.233V8.943L8.34 8.85c-.093-.42.14-1.026.793-1.073l3.453-.234 4.758 7.28V8.57l-1.213-.14c-.093-.514.28-.887.747-.933zM3.386 1.327L16.94.454c1.68-.14 2.1.093 2.8.606l3.873 2.706c.467.327.607.747.607 1.26v16.464c0 1.073-.374 1.727-1.68 1.82L6.694 24.04c-.98.047-1.447-.093-1.96-.747L1.38 19.067c-.56-.747-.793-1.307-.793-1.96V3.14c0-.84.373-1.54 1.306-1.633l1.493-.18z" />
        </svg>
      ),
      category: "project_management",
    },
    {
      id: "pagerduty",
      name: "PagerDuty",
      description: "Incidents, on-call schedules, and alert management.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#06AC38">
          <path d="M16.965 1.18C15.085.164 13.769 0 10.683 0H3.73v14.55h6.926c2.743 0 4.8-.164 6.61-1.37 1.975-1.303 3.004-3.443 3.004-6.003 0-2.888-1.262-4.862-3.305-5.997zM12.19 10.237c-1.060.438-2.323.438-3.925.438H7.455V3.662h1.15c1.672 0 2.757.055 3.64.493 1.004.493 1.59 1.535 1.59 2.932 0 1.48-.657 2.668-1.645 3.15zM3.73 18.213h3.725V24H3.73z" />
        </svg>
      ),
      category: "development",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-accent/25 border-t-accent rounded-full animate-spin mb-3" />
        <p className="text-xs text-muted">Checking integration status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Integrations
        </h1>
        <p className="text-sm text-muted mt-1">
          Connect your tools to give Rootly full context across your engineering org.
        </p>
      </div>

      {/* Sync global banner message */}
      {syncResult && (
        <div className="bg-[#111] border border-border px-4 py-3 rounded-xl flex items-center justify-between text-xs text-foreground/95">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>{syncResult}</span>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-muted hover:text-foreground bg-transparent border-none cursor-pointer">✕</button>
        </div>
      )}

      {/* Connected count */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-success" />
        <span className="text-xs text-muted">
          {INTEGRATIONS.filter((i) => isConnected(i.id)).length} connected ·{" "}
          {INTEGRATIONS.filter((i) => !isConnected(i.id)).length} available
        </span>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const items = INTEGRATIONS.filter((i) => i.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key}>
            <h3 className="text-[11px] font-semibold text-muted-dark uppercase tracking-wider mb-3 px-1">
              {cat.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((integration) => {
                const connected = isConnected(integration.id);
                return (
                  <div
                    key={integration.id}
                    className={`bg-surface border rounded-xl p-5 flex flex-col gap-4 transition-all hover:border-accent-border ${
                      connected
                        ? "border-border"
                        : "border-border-subtle opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center">
                        {integration.icon}
                      </div>
                      {connected ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Connected
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-muted-dark bg-surface-elevated px-2 py-0.5 rounded-full border border-border-subtle">
                          Available
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {integration.name}
                      </h4>
                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        {integration.description}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="mt-auto pt-1">
                      {connected ? (
                        <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                          <div className="flex items-center justify-between text-[10px] text-muted-dark font-mono">
                            <span>Last sync:</span>
                            <span>{getLastSyncTime(integration.id)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <button
                              disabled={syncingProvider !== null}
                              onClick={() => handleSync(integration.id)}
                              className="text-xs text-accent hover:text-white font-medium transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 disabled:opacity-50"
                            >
                              {syncingProvider === integration.id ? "Syncing..." : "Sync now ↻"}
                            </button>
                            <button
                              onClick={() => handleDisconnect(integration.id)}
                              className="text-xs text-danger hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none p-0"
                            >
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (integration.id === "github") {
                              setIsModalOpen(true);
                            } else {
                              alert(`${integration.name} integration is coming soon in the next phase!`);
                            }
                          }}
                          className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-accent/10 text-accent border border-accent-border hover:bg-accent hover:text-black transition-all cursor-pointer"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* GitHub Connect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Connect GitHub</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setErrorMsg("");
                }}
                className="text-muted hover:text-foreground bg-transparent border-none cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted leading-normal">
              Enter a GitHub Personal Access Token (PAT) to authorize Rootly. Fine-grained or classic tokens are supported. Ensure the token has permissions to read repositories and commits.
            </p>

            {errorMsg && (
              <div className="p-3 text-xs bg-danger/10 text-danger border border-danger/25 rounded-lg">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 text-xs bg-success/10 text-success border border-success/25 rounded-lg">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleConnectGithub} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted uppercase tracking-wider">
                  Personal Access Token (PAT)
                </label>
                <input
                  type="password"
                  placeholder="ghp_..."
                  value={githubPat}
                  onChange={(e) => setGithubPat(e.target.value)}
                  disabled={connecting}
                  required
                  className="w-full bg-[#09090B] border border-white/5 hover:border-white/10 focus:border-accent-border focus:ring-1 focus:ring-accent-border/10 rounded-lg py-2.5 px-3.5 text-xs text-foreground placeholder-muted-dark outline-none transition-all"
                />
              </div>

              <div className="text-[10px] text-muted-dark leading-relaxed font-mono">
                💡 Need a token? Create one in your{" "}
                <a
                  href="https://github.com/settings/tokens/new?description=Rootly%20App&scopes=repo,read:user"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  GitHub settings
                </a>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={connecting}
                  className="px-4 py-2 text-xs font-semibold text-muted hover:text-foreground bg-transparent border border-border rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connecting}
                  className="px-4 py-2 text-xs font-semibold bg-accent hover:bg-teal-400 active:scale-[0.98] text-black rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connecting ? "Connecting..." : "Connect GitHub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
