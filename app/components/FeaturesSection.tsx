"use client";

import React from "react";
import { Icons } from "./Icons";

export default function FeaturesSection() {
  const features = [
    {
      icon: Icons.shield,
      title: "Proof-Based Answers",
      desc: "Every response includes exact sources — PR diffs, Jira tickets, Slack threads, meeting timestamps. Nothing is hallucinated.",
      themeClasses: "bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399]",
    },
    {
      icon: Icons.brain,
      title: "Live Company Memory",
      desc: "A continuously updated knowledge graph of your sprints, blockers, deployments, and team decisions. Always current.",
      themeClasses: "bg-[#14B8A6]/10 border border-[#14B8A6]/20 text-[#2DD4BF]",
    },
    {
      icon: Icons.chart,
      title: "Auto Standups & Reports",
      desc: "AI-generated daily and weekly engineering reports with risk flags, blockers, and velocity insights. No manual effort.",
      themeClasses: "bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#A78BFA]",
    },
    {
      icon: Icons.mic,
      title: "Meeting Copilot",
      desc: "Real-time context lookups during meetings, auto-generated action items, and searchable transcripts. No intrusive bots.",
      themeClasses: "bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#FBBF24]",
    },
    {
      icon: Icons.link,
      title: "Deep Cross-Tool Reasoning",
      desc: '"Why is latency up?" — Rootly traces across code changes, incidents, Slack discussions, and deployment logs to find the answer.',
      themeClasses: "bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#60A5FA]",
    },
    {
      icon: Icons.alert,
      title: "Proactive Risk Alerts",
      desc: "Get notified about velocity drops, stalled PRs, scope creep, and potential blockers before they become problems.",
      themeClasses: "bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#F87171]",
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
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${f.themeClasses}`}>
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
