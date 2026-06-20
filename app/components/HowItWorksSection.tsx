"use client";

import React from "react";
import { Icons } from "./Icons";

export default function HowItWorksSection() {
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
    <section className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-[72px]">
          <div className="section-label reveal">How It Works</div>
          <h2 className="section-title reveal delay-1">
            From setup to insight in minutes.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto">
            Four simple steps to give your team a living, breathing intelligence
            layer.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 relative">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal delay-${i + 1} flex flex-col gap-5 relative py-8 px-6`}
            >
              {/* Step number */}
              <div className="text-[11px] font-semibold text-[#14B8A6] tracking-[0.08em] font-mono">
                STEP {step.num}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#14B8A6]/8 border border-[#14B8A6]/15 flex items-center justify-center text-[#14B8A6]">
                {step.icon}
              </div>

              <h3 className="text-[18px] font-semibold text-[#F1F1F1] tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-[1.7]">
                {step.desc}
              </p>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="step-connector absolute top-[76px] -right-3 w-6 h-[1px] bg-[#14B8A6]/15 md:block hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
