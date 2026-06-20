"use client";

import React from "react";

export default function IntegrationsSection() {
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
    <section id="integrations" className="section-padding relative">
      <div className="container-main">
        <div className="text-center mb-14">
          <div className="section-label reveal">Integrations</div>
          <h2 className="section-title reveal delay-1">
            Connects to the tools you already use.
          </h2>
          <p className="section-subtitle reveal delay-2 mx-auto">
            One-click setup. Zero configuration. Rootly works with your existing
            workflow — no migration needed.
          </p>
        </div>

        {/* Integration grid */}
        <div className="reveal delay-3 flex flex-wrap justify-center gap-3 max-w-[800px] mx-auto">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="py-3 px-5 bg-[#111111] border border-white/6 rounded-lg text-[13px] text-[#9CA3AF] font-medium transition-all duration-200 cursor-default flex items-center gap-2 hover:border-[#14B8A6]/30 hover:text-[#CCFBF1] hover:bg-[#14B8A6]/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${item.slug}/${item.color}`}
                alt={item.name}
                width={16}
                height={16}
                className="opacity-80"
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <p className="reveal delay-4 text-center mt-8 text-[13px] text-[#6B7280]">
          and <strong className="text-[#9CA3AF]">20+ more</strong> with custom
          webhook & API support
        </p>
      </div>
    </section>
  );
}
