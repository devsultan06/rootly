"use client";

import React from "react";

const SlackIcon = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
    <path fill="#E01E5A" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
    <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" />
    <path fill="#36C5F0" d="M8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
    <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" />
    <path fill="#2EB67D" d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
    <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" />
    <path fill="#ECB22E" d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

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
      name: "Slack",
      desc: "Decisions disappear in threads",
      svg: true,
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
                {silo.svg ? (
                  <SlackIcon size={32} className="opacity-70" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={silo.logo}
                    alt={silo.name}
                    width={32}
                    height={32}
                    className="opacity-70"
                  />
                )}
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
