"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcons } from "./components/DashboardIcons";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: DashboardIcons.home },
  { label: "Ask AI", href: "/dashboard/ask-ai", icon: DashboardIcons.sparkles },
  {
    label: "Team Activity",
    href: "/dashboard/team-activity",
    icon: DashboardIcons.activity,
  },
  {
    label: "Projects",
    href: "/dashboard/projects",
    icon: DashboardIcons.folder,
  },
  {
    label: "Integrations",
    href: "/dashboard/integrations",
    icon: DashboardIcons.integrations,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: DashboardIcons.settings,
  },
];

const AI_ACTIONS = [
  {
    label: "Generate Standup",
    icon: DashboardIcons.clipboard,
    query: "Generate daily standup based on today's activity",
  },
  {
    label: "Summarize Sprint",
    icon: DashboardIcons.sprint,
    query: "Summarize Sprint 24 progress and achievements",
  },
  {
    label: "Find Blockers",
    icon: DashboardIcons.blocker,
    query: "Find blockers and overdue tasks right now",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiActionsOpen, setAiActionsOpen] = useState(true);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[240px] bg-surface border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border flex-shrink-0">
          <span className="text-accent">{DashboardIcons.root}</span>
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
            Rootly
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto flex flex-col">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium no-underline transition-all duration-150 group ${
                    active
                      ? "bg-accent-muted text-accent border border-accent-border"
                      : "text-muted hover:text-foreground hover:bg-surface-hover border border-transparent"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 transition-colors ${
                      active
                        ? "text-accent"
                        : "text-muted-dark group-hover:text-muted"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Quick AI Actions Collapsible Section */}
          <div className="mt-5 pt-4 border-t border-border/40">
            <button
              onClick={() => setAiActionsOpen(!aiActionsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-dark hover:text-foreground tracking-wider uppercase transition-colors bg-transparent border-none cursor-pointer text-left outline-none"
            >
              <span>Quick AI Actions</span>
              <span className={`transition-transform duration-200 ${aiActionsOpen ? "rotate-180" : ""}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            {aiActionsOpen && (
              <div className="mt-1.5 space-y-0.5 animate-fade-in">
                {AI_ACTIONS.map((action) => (
                  <Link
                    key={action.label}
                    href={`/dashboard/ask-ai?q=${encodeURIComponent(action.query)}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted hover:text-foreground hover:bg-surface-hover no-underline transition-colors group"
                  >
                    <span className="flex-shrink-0 text-muted-dark group-hover:text-muted transition-colors">
                      {action.icon}
                    </span>
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-border p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent-border flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
              SC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                Sultan C.
              </p>
              <p className="text-[11px] text-muted-dark truncate">
                sultan@rootly.io
              </p>
            </div>
            <Link
              href="/"
              className="text-muted-dark hover:text-foreground transition-colors flex-shrink-0"
              title="Sign out"
            >
              {DashboardIcons.logout}
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 h-14 px-4 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-surface-hover text-foreground bg-transparent border-none cursor-pointer"
            aria-label="Open sidebar"
          >
            {DashboardIcons.menu}
          </button>
          <span className="text-accent">{DashboardIcons.root}</span>
          <div className="w-8" /> {/* spacer */}
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
