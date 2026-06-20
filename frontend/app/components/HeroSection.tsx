"use client";

import React from "react";
import { Icons } from "./Icons";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden pt-[100px] pb-[60px]"
    >
      {/* Subtle grid background */}
      <div className="grid-pattern absolute inset-0 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.06)_0%,transparent_70%)] pointer-events-none" />

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
          <a href="/get-started" className="btn-primary py-3.5 px-8 text-[15px]">
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
            <div className="hidden md:flex w-[220px] border-r border-border-subtle p-5 px-4 flex-col gap-1 text-left">
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
                <div className="bg-accent-muted/12 border border-accent-border rounded-[12px_12px_4px_12px] py-3 px-[18px] text-sm text-[#99F6E4] max-w-[400px]">
                  What changed in auth this sprint?
                </div>
              </div>

              {/* Answer */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#14B8A6] flex items-center justify-center flex-shrink-0 text-[12px] text-white font-semibold">
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
