    "use client";

import { useEffect, useRef, useState } from "react";
import IntegrationGraph from "./components/IntegrationGraph";

/* ──────────────────────────────────────────────
   SVG Icons (line-style, consistent weight)
   ────────────────────────────────────────────── */

const Icons = {
  root: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 2L14 10M14 10C14 10 8 14 8 18C8 22 11 26 14 26C17 26 20 22 20 18C20 14 14 10 14 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 20C10 20 6 19 4 22M18 20C18 20 22 19 24 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  search: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="5.5" />
      <path d="M12.5 12.5L16 16" />
    </svg>
  ),
  shield: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2L3 5.5V10C3 14.5 6 17.5 10 18.5C14 17.5 17 14.5 17 10V5.5L10 2Z" />
      <path d="M7 10L9 12L13 8" />
    </svg>
  ),
  brain: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 18V10M10 10C8 8 5 7 4 9C3 11 5 12 6 11M10 10C12 8 15 7 16 9C17 11 15 12 14 11M7 5C6 3 8 2 10 2C12 2 14 3 13 5" />
    </svg>
  ),
  chart: (
<svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17V11M8 17V7M13 17V10M18 17V4" />
    </svg>
  ),
  mic: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="2" width="6" height="10" rx="3" />
      <path d="M4 9C4 12.3 6.7 15 10 15C13.3 15 16 12.3 16 9M10 15V18M7 18H13" />
    </svg>
  ),
  link: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 12L12 8M6.5 10.5L4 13C2.5 14.5 2.5 17 4 18.5C5.5 20 8 20 9.5 18.5L12 16M13.5 9.5L16 7C17.5 5.5 17.5 3 16 1.5C14.5 0 12 0 10.5 1.5L8 4" />
    </svg>
  ),
  alert: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2L18 17H2L10 2Z" />
      <path d="M10 8V12M10 14.5V15" />
    </svg>
  ),
  play: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="4,2 14,8 4,14" fill="currentColor" stroke="none" />
    </svg>
  ),
  arrow: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 7H13M9 3L13 7L9 11" />
    </svg>
  ),
  check: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8L6.5 11.5L13 4.5" />
    </svg>
  ),
  connect: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="4" cy="4" r="2" />
      <circle cx="16" cy="4" r="2" />
      <circle cx="4" cy="16" r="2" />
      <circle cx="16" cy="16" r="2" />
      <path d="M6 4H14M4 6V14M16 6V14M6 16H14" />
    </svg>
  ),
  plug: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 2V6M13 2V6M5 6H15C15 6 16 6 16 7V9C16 12.3 13.3 15 10 15C6.7 15 4 12.3 4 9V7C4 6 5 6 5 6ZM10 15V18" />
    </svg>
  ),
  star: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      stroke="none"
    >
      <path d="M7 0.5L8.6 5H13.5L9.4 7.9L11 12.5L7 9.5L3 12.5L4.6 7.9L0.5 5H5.4L7 0.5Z" />
    </svg>
  ),
};

/* ──────────────────────────────────────────────
   Intersection Observer Hook
   ────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ──────────────────────────────────────────────
   NAVBAR
   ────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 no-underline text-foreground"
        >
          <span className="text-accent">{Icons.root}</span>
          <span className="text-[18px] font-semibold tracking-[-0.03em]">
            Rootly
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Solutions", "Integrations", "Resources", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[13px] text-muted hover:text-foreground no-underline transition-colors duration-200 font-[450] tracking-[-0.01em]"
              >
                {item}
              </a>
            ),
          )}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-[13px] text-muted hover:text-foreground no-underline font-[450] transition-colors duration-200"
          >
            Log in
          </a>
          <a href="#cta" className="btn-primary py-2 px-5 text-[13px]">
            Request Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden block bg-transparent border-none text-foreground cursor-pointer p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <path d="M6 6L18 18" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7H20" />
                <path d="M4 12H20" />
                <path d="M4 17H20" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 py-4 pb-6 border-t border-border">
          {["Product", "Solutions", "Integrations", "Resources", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] text-muted hover:text-foreground no-underline font-[450]"
              >
                {item}
              </a>
            ),
          )}
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              className="text-[14px] text-muted hover:text-foreground no-underline flex items-center"
            >
              Log in
            </a>
            <a href="#cta" className="btn-primary py-2 px-5 text-[13px]">
              Request Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ──────────────────────────────────────────────
   HERO SECTION
   ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-[100px] pb-[60px]"
    >
      {/* Subtle grid background */}
      <div className="grid-pattern absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-main relative z-10">
        {/* Headline */}
        <h1 className="reveal delay-1 text-[clamp(36px,5vw,68px)] font-[650] tracking-[-0.035em] leading-[1.08] max-w-[800px] mx-auto mb-6 text-foreground">
          The AI Company Brain
          <br />
          for Engineering Teams
        </h1>

        {/* Subheadline */}
        <p className="reveal delay-2 text-[clamp(15px,1.3vw,18px)] text-muted leading-[1.7] max-w-[580px] mx-auto mb-10">
          Real-time reasoning across Jira, GitHub, Slack, meetings, and code.
          <br className="hidden md:inline" />
          Every answer comes with proof. Built for teams that ship at speed.
        </p>

        {/* CTAs */}
        <div className="reveal delay-3 flex items-center justify-center gap-3.5 flex-wrap mb-16">
          <a href="#cta" className="btn-primary py-3.5 px-8 text-[15px]">
            Get Started Free
            {Icons.arrow}
          </a>
          <a href="#" className="btn-secondary py-3.5 px-8 text-[15px]">
            {Icons.play}
            Watch 2-min Demo
          </a>
        </div>

        {/* Dashboard Mock */}
        <div className="reveal delay-4 max-w-[960px] mx-auto bg-surface rounded-2xl border border-border overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Window chrome */}
          <div className="flex items-center gap-2 py-3.5 px-5 border-b border-border-subtle">
            <div className="w-2.5 h-2.5 rounded-full bg-danger/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
            <div className="ml-auto text-[11px] text-muted-dark font-mono">
              rootly.ai/workspace
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex min-h-[360px]">
            {/* Sidebar */}
            <div className="hidden md:flex dashboard-sidebar w-[220px] border-r border-border-subtle p-5 px-4 flex flex-col gap-1 text-left">
              {[
                { label: "Ask Rootly", active: true },
                { label: "Sprint Overview", active: false },
                { label: "Team Pulse", active: false },
                { label: "Standups", active: false },
                { label: "Risk Alerts", active: false },
                { label: "Integrations", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-2 px-3 rounded-md text-[13px] cursor-pointer transition-colors ${
                    item.active
                      ? "text-foreground bg-accent-muted font-medium"
                      : "text-muted-dark bg-transparent hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main chat area */}
            <div className="flex-1 p-6 flex flex-col gap-5 text-left">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-accent-muted/12 border border-accent-border rounded-[12px_12px_4px_12px] py-3 px-[18px] text-sm text-[#C7D2FE] max-w-[400px]">
                  What changed in auth this sprint?
                </div>
              </div>

              {/* Answer */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#14B8A6] flex items-center justify-center flex-shrink-0 text-[12px] text-white font-semibold">
                  R
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-light leading-[1.7] mb-[14px]">
                    <strong className="text-foreground font-semibold">
                      3 significant changes
                    </strong>{" "}
                    to the auth module this sprint. Here&apos;s a breakdown with
                    sources:
                  </div>

                  {/* Source cards */}
                  <div className="flex flex-col gap-2">
                    {[
                      {
                        type: "PR",
                        color: "#22C55E",
                        title: "Migrate to OAuth 2.1 PKCE flow",
                        meta: "PR #1847 · merged 2d ago · 14 files",
                      },
                      {
                        type: "Jira",
                        color: "#3B82F6",
                        title: "AUTH-312: Session timeout edge case fix",
                        meta: "In Review · linked to 3 commits",
                      },
                      {
                        type: "Slack",
                        color: "#F59E0B",
                        title: "Discussion: Token rotation strategy",
                        meta: "#eng-backend · 12 messages · yesterday",
                      },
                    ].map((source) => (
                      <div
                        key={source.title}
                        className="flex items-center gap-2.5 py-2.5 px-3.5 bg-white/[0.025] rounded-lg border border-border-subtle text-[12px]"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: source.color }}
                        />
                        <div>
                          <div className="text-muted-light font-medium mb-0.5">
                            {source.title}
                          </div>
                          <div className="text-muted-dark">{source.meta}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Confidence */}
                  <div className="mt-[14px] flex items-center gap-2 text-[11px] text-muted-dark">
                    <span className="text-success">{Icons.check}</span>
                    <span>
                      High confidence · 7 sources verified · Last updated 4 min
                      ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="reveal delay-5 mt-14 flex flex-col items-center gap-5">
          <p className="text-[12px] text-muted-dark tracking-[0.04em] uppercase font-medium">
            Trusted by engineering teams at
          </p>
          <div className="flex items-center gap-10 flex-wrap justify-center opacity-40">
            {["Vercel", "Stripe", "Linear", "Datadog", "Figma"].map((name) => (
              <span
                key={name}
                className="text-base font-semibold text-foreground tracking-tight"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   PROBLEM SECTION
   ────────────────────────────────────────────── */
function ProblemSection() {
  const silos = [
    {
      logo: "https://cdn.simpleicons.org/jira/2684FF",
      name: "Jira",
      desc: "Tickets & epics live in isolation",
    },
    {
      logo: "https://cdn.simpleicons.org/github/E6EDF3",
      name: "GitHub",
      desc: "PRs & code changes lose context",
    },
    {
      logo: "https://cdn.simpleicons.org/slack/4A154B",
      name: "Slack",
      desc: "Decisions disappear in threads",
    },
    {
      logo: "https://cdn.simpleicons.org/googlemeet/00897B",
      name: "Meetings",
      desc: "Action items are lost after calls",
    },
  ];

  return (
    <section id="product" className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-16">
          <div className="section-label reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            The Problem
          </div>
          <h2 className="section-title reveal delay-1">
            Engineering knowledge is fragmented.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto">
            Your team&apos;s critical context is scattered across dozens of
            tools, threads, and meetings. Finding answers means interrupting
            someone or digging for hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {silos.map((silo, i) => (
            <div
              key={silo.name}
              className={`card reveal delay-${i + 1} text-center py-10 px-7 relative`}
            >
              <div className="mb-4 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={silo.logo}
                  alt={silo.name}
                  width={32}
                  height={32}
                  className="opacity-70"
                />
              </div>
              <h3 className="text-[16px] font-semibold text-foreground mb-2 tracking-tight">
                {silo.name}
              </h3>
              <p className="text-sm text-muted-dark leading-normal">
                {silo.desc}
              </p>

              {/* Disconnection indicator */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-danger/30 border border-danger/40" />
            </div>
          ))}
        </div>

        {/* Disconnection visual */}
        <div className="reveal delay-5 text-center mt-10 text-[13px] text-muted-dark flex items-center justify-center gap-3">
          <span className="w-12 h-[1px] bg-danger/20" />
          <span className="text-danger/60">No connections between tools</span>
          <span className="w-12 h-[1px] bg-danger/20" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   SOLUTION SECTION
   ────────────────────────────────────────────── */
function SolutionSection() {
  return (
    <section id="solutions" className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-14">
          <div className="section-label reveal">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            The Solution
          </div>
          <h2 className="section-title reveal delay-1 max-w-[640px] mx-auto mb-4">
            One unified intelligence layer that understands everything.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto">
            Rootly connects to every tool your engineering team uses and builds
            a live knowledge graph — so anyone can ask anything and get
            verified, sourced answers in seconds.
          </p>
        </div>

        {/* Intelligence Graph Visual */}
        <div className="reveal delay-3 max-w-[800px] mx-auto p-12 bg-surface rounded-2xl border border-border relative overflow-hidden">
          {/* Center Node */}
          <div className="flex flex-col items-center gap-10">
            {/* Top row tools */}
            <div className="flex justify-center gap-6 flex-wrap">
              {["Jira", "GitHub", "Slack", "Linear"].map((tool) => (
                <div
                  key={tool}
                  className="py-2.5 px-5 bg-white/[0.03] border border-border-subtle rounded-lg text-[13px] text-muted font-medium"
                >
                  {tool}
                </div>
              ))}
            </div>

            {/* Connection lines visual */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[1px] h-8 bg-gradient-to-b from-accent/30 to-accent/10"
                />
              ))}
            </div>

            {/* Center Rootly node */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent/15 to-teal/15 border border-accent/30 flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                <span className="text-[#818CF8] scale-[1.3]">{Icons.root}</span>
              </div>
              <span className="text-sm font-semibold text-[#C7D2FE] tracking-tight">
                Rootly Intelligence Graph
              </span>
              <span className="text-xs text-muted-dark">
                Continuous learning · Real-time sync · Proof-based
              </span>
            </div>

            {/* Connection lines down */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-[1px] h-8 bg-gradient-to-b from-teal/10 to-teal/30"
                />
              ))}
            </div>

            {/* Bottom row tools */}
            <div className="flex justify-center gap-6 flex-wrap">
              {["Zoom", "Google Meet", "Confluence", "Notion"].map((tool) => (
                <div
                  key={tool}
                  className="py-2.5 px-5 bg-white/[0.03] border border-border-subtle rounded-lg text-[13px] text-muted font-medium"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Pulse rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-accent/6 pointer-events-none animate-pulse-slow" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FEATURES SECTION
   ────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: Icons.shield,
      title: "Proof-Based Answers",
      desc: "Every response includes exact sources — PR diffs, Jira tickets, Slack threads, meeting timestamps. Nothing is hallucinated.",
      color: "#4F46E5",
    },
    {
      icon: Icons.brain,
      title: "Live Company Memory",
      desc: "A continuously updated knowledge graph of your sprints, blockers, deployments, and team decisions. Always current.",
      color: "#14B8A6",
    },
    {
      icon: Icons.chart,
      title: "Auto Standups & Reports",
      desc: "AI-generated daily and weekly engineering reports with risk flags, blockers, and velocity insights. No manual effort.",
      color: "#8B5CF6",
    },
    {
      icon: Icons.mic,
      title: "Meeting Copilot",
      desc: "Real-time context lookups during meetings, auto-generated action items, and searchable transcripts. No intrusive bots.",
      color: "#F59E0B",
    },
    {
      icon: Icons.link,
      title: "Deep Cross-Tool Reasoning",
      desc: '"Why is latency up?" — Rootly traces across code changes, incidents, Slack discussions, and deployment logs to find the answer.',
      color: "#3B82F6",
    },
    {
      icon: Icons.alert,
      title: "Proactive Risk Alerts",
      desc: "Get notified about velocity drops, stalled PRs, scope creep, and potential blockers before they become problems.",
      color: "#EF4444",
    },
  ];

  return (
    <section className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-16">
          <div className="section-label reveal">Features</div>
          <h2 className="section-title reveal delay-1">
            Built for how engineering teams actually work.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto">
            Six core capabilities that transform scattered knowledge into
            actionable, sourced intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`card reveal delay-${(i % 3) + 1} p-8 flex flex-col gap-4`}
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                style={{
                  background: `${f.color}10`,
                  border: `1px solid ${f.color}20`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-[17px] font-semibold text-foreground tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   HOW IT WORKS SECTION
   ────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect Your Tools",
      desc: "One-click integrations with Jira, GitHub, Slack, Google Meet, Zoom, Linear, and 20+ more. Setup takes under 5 minutes.",
      icon: Icons.plug,
    },
    {
      num: "02",
      title: "Rootly Learns & Indexes",
      desc: "Our AI builds a real-time knowledge graph of your projects, teams, code, tickets, discussions, and meeting history.",
      icon: Icons.brain,
    },
    {
      num: "03",
      title: "Ask Anything, Get Proof",
      desc: "Natural language questions with verified, source-linked answers. Every claim traceable back to the exact PR, ticket, or message.",
      icon: Icons.search,
    },
    {
      num: "04",
      title: "Get Proactive Insights",
      desc: "Automatic standups, risk alerts, and engineering reports generated daily — surfacing what matters before you even ask.",
      icon: Icons.chart,
    },
  ];

  return (
    <section className="section-padding" style={{ position: "relative" }}>
      <div className="container-main">
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label reveal">How It Works</div>
          <h2 className="section-title reveal delay-1">
            From setup to insight in minutes.
          </h2>
          <p
            className="section-subtitle reveal delay-2"
            style={{ margin: "0 auto" }}
          >
            Four simple steps to give your team a living, breathing intelligence
            layer.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal delay-${i + 1}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
                padding: "32px 24px",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#4F46E5",
                  letterSpacing: "0.08em",
                  fontFamily: "var(--font-mono)",
                }}
              >
                STEP {step.num}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(79, 70, 229, 0.08)",
                  border: "1px solid rgba(79, 70, 229, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                }}
              >
                {step.icon}
              </div>

              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#F1F1F1",
                  letterSpacing: "-0.02em",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.7 }}>
                {step.desc}
              </p>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="step-connector"
                  style={{
                    position: "absolute",
                    top: 76,
                    right: -12,
                    width: 24,
                    height: 1,
                    background: "rgba(79, 70, 229, 0.15)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .step-connector { display: none; }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────
   TESTIMONIALS SECTION
   ────────────────────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Rootly cut our sprint retrospective prep from 3 hours to 10 minutes. It already knows what happened, with receipts.",
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "Acme Corp",
      initials: "SC",
    },
    {
      quote:
        "New engineers get productive in days instead of weeks. They just ask Rootly for context instead of interrupting seniors.",
      name: "Marcus Johnson",
      role: "CTO",
      company: "Buildkit",
      initials: "MJ",
    },
    {
      quote:
        "The proof-based answers are a game changer. We stopped debating what happened — Rootly shows us the exact PR, thread, and meeting clip.",
      name: "Elena Rodriguez",
      role: "Engineering Lead",
      company: "Streamline",
      initials: "ER",
    },
  ];

  const stats = [
    { value: "6+", unit: "hours", desc: "saved per engineer per week" },
    { value: "95%", unit: "", desc: "faster context for new hires" },
    { value: "73%", unit: "", desc: "fewer interruptions across teams" },
    { value: "< 5", unit: "min", desc: "setup time per integration" },
  ];

  return (
    <section className="section-padding" style={{ position: "relative" }}>
      <div className="container-main">
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label reveal">Social Proof</div>
          <h2 className="section-title reveal delay-1">
            Trusted by teams who ship fast.
          </h2>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 56,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.desc}
              className={`reveal delay-${i + 1}`}
              style={{
                textAlign: "center",
                padding: "32px 16px",
                background: "#111111",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#F1F1F1",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
                {stat.unit && (
                  <span
                    style={{
                      fontSize: 16,
                      color: "#9CA3AF",
                      fontWeight: 500,
                      marginLeft: 4,
                    }}
                  >
                    {stat.unit}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 6 }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`card reveal delay-${i + 1}`}
              style={{
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  marginBottom: 20,
                  color: "#F59E0B",
                }}
              >
                {[0, 1, 2, 3, 4].map((s) => (
                  <span key={s}>{Icons.star}</span>
                ))}
              </div>

              <p
                style={{
                  fontSize: 15,
                  color: "#D1D5DB",
                  lineHeight: 1.7,
                  marginBottom: 28,
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar placeholder */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4F46E5, #14B8A6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#F1F1F1",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   INTEGRATIONS SECTION
   ────────────────────────────────────────────── */
function IntegrationsSection() {
  const integrations = [
    { name: "Jira", slug: "jira", color: "2684FF" },
    { name: "GitHub", slug: "github", color: "E6EDF3" },
    { name: "Slack", slug: "slack", color: "4A154B" },
    { name: "Linear", slug: "linear", color: "5E6AD2" },
    { name: "Zoom", slug: "zoom", color: "0B5CFF" },
    { name: "Google Meet", slug: "googlemeet", color: "00897B" },
    { name: "GitLab", slug: "gitlab", color: "FC6D26" },
    { name: "Confluence", slug: "confluence", color: "2684FF" },
    { name: "Notion", slug: "notion", color: "FFFFFF" },
    { name: "PagerDuty", slug: "pagerduty", color: "06AC38" },
    { name: "Datadog", slug: "datadog", color: "632CA6" },
    { name: "Figma", slug: "figma", color: "F24E1E" },
    { name: "Asana", slug: "asana", color: "F06A6A" },
    { name: "Bitbucket", slug: "bitbucket", color: "0052CC" },
    { name: "Microsoft Teams", slug: "microsoftteams", color: "6264A7" },
    { name: "CircleCI", slug: "circleci", color: "343434" },
  ];

  return (
    <section
      id="integrations"
      className="section-padding"
      style={{ position: "relative" }}
    >
      <div className="container-main">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-label reveal">Integrations</div>
          <h2 className="section-title reveal delay-1">
            Connects to the tools you already use.
          </h2>
          <p
            className="section-subtitle reveal delay-2"
            style={{ margin: "0 auto" }}
          >
            One-click setup. Zero configuration. Rootly works with your existing
            workflow — no migration needed.
          </p>
        </div>

        {/* Integration grid */}
        <div
          className="reveal delay-3"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 12,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {integrations.map((item) => (
            <div
              key={item.name}
              style={{
                padding: "12px 20px",
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                fontSize: 13,
                color: "#9CA3AF",
                fontWeight: 500,
                transition: "all 0.2s ease",
                cursor: "default",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.3)";
                e.currentTarget.style.color = "#C7D2FE";
                e.currentTarget.style.background = "rgba(79, 70, 229, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#9CA3AF";
                e.currentTarget.style.background = "#111111";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${item.slug}/${item.color}`}
                alt={item.name}
                width={16}
                height={16}
                style={{ opacity: 0.8 }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <p
          className="reveal delay-4"
          style={{
            textAlign: "center",
            marginTop: 32,
            fontSize: 13,
            color: "#6B7280",
          }}
        >
          and <strong style={{ color: "#9CA3AF" }}>20+ more</strong> with custom
          webhook & API support
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CTA SECTION
   ────────────────────────────────────────────── */
function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="cta"
      className="section-padding"
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Subtle glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container-main"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div className="section-label reveal">Get Started</div>
          <h2
            className="section-title reveal delay-1"
            style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
          >
            Give your engineering team a brain upgrade.
          </h2>
          <p
            className="section-subtitle reveal delay-2"
            style={{ margin: "0 auto 40px" }}
          >
            Set up in under 5 minutes. Free for teams up to 10 engineers. No
            credit card required.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="reveal delay-3"
              style={{
                display: "flex",
                gap: 8,
                maxWidth: 460,
                margin: "0 auto",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  minWidth: 240,
                  padding: "14px 18px",
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  color: "#F1F1F1",
                  fontSize: 14,
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(79, 70, 229, 0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
                }
              />
              <button
                type="submit"
                className="btn-primary"
                style={{
                  padding: "14px 32px",
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                Request Demo
                {Icons.arrow}
              </button>
            </form>
          ) : (
            <div
              className="reveal"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "16px 24px",
                background: "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.15)",
                borderRadius: 10,
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <span style={{ color: "#22C55E" }}>{Icons.check}</span>
              <span style={{ fontSize: 14, color: "#D1D5DB" }}>
                Thanks! We&apos;ll be in touch within 24 hours.
              </span>
            </div>
          )}

          <p
            className="reveal delay-4"
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 20,
            }}
          >
            Free up to 10 engineers · Enterprise plans available · SOC 2
            compliant
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────── */
function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        "Ask Rootly",
        "Sprint Intelligence",
        "Meeting Copilot",
        "Risk Alerts",
        "Standups",
        "Changelog",
      ],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: [
        "Documentation",
        "API Reference",
        "Security",
        "Privacy Policy",
        "Terms of Service",
      ],
    },
    {
      title: "Connect",
      links: ["Twitter / X", "LinkedIn", "GitHub", "Discord"],
    },
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "64px 0 40px",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 40,
            marginBottom: 56,
          }}
        >
          {/* Logo column */}
          <div>
            <a
              href="#"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "#F1F1F1",
                marginBottom: 16,
              }}
            >
  <a
          href="#"
          className="flex items-center gap-2.5 no-underline text-foreground"
        >
          <span className="text-accent">{Icons.root}</span>
   
        </a>              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                Rootly
              </span>
            </a>
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 1.6,
                maxWidth: 200,
              }}
            >
              The AI operating system for engineering teams.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#9CA3AF",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {col.title}
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#D1D5DB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#6B7280")
                    }
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.04)",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <p style={{ fontSize: 12, color: "#4B5563" }}>
            © 2026 Rootly, Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <a
              href="#"
              style={{ fontSize: 12, color: "#4B5563", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
            >
              Privacy
            </a>
            <a
              href="#"
              style={{ fontSize: 12, color: "#4B5563", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
            >
              Terms
            </a>
            <a
              href="#"
              style={{ fontSize: 12, color: "#4B5563", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────── */
export default function LandingPage() {
  useReveal();

  return (
    <main className="circuit-bg">
      <Navbar />
      <HeroSection />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <ProblemSection />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <IntegrationGraph />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <FeaturesSection />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <HowItWorksSection />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <TestimonialsSection />
      <div
        className="section-divider"
        style={{ margin: "0 auto", maxWidth: 1200 }}
      />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
