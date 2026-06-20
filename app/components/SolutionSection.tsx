"use client";

import React from "react";
import { Icons } from "./Icons";

export default function SolutionSection() {
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
              <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent/15 to-teal/15 border border-accent/30 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.15)]">
                <span className="text-[#2DD4BF] scale-[1.3]">{Icons.root}</span>
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
