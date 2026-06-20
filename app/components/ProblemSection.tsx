"use client";

import React from "react";

export default function ProblemSection() {
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
            </div>
          ))}
        </div>

        {/* Disconnection visual */}
        <div className="reveal delay-5 text-center mt-10 text-[13px] text-muted-dark flex items-center justify-center gap-3">
          <span className="w-12 h-[1px] bg-white/10" />
          <span className="text-muted-dark">No connections between tools</span>
          <span className="w-12 h-[1px] bg-white/10" />
        </div>
      </div>
    </section>
  );
}
