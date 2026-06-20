"use client";

import React from "react";

const SlackIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
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

export default function IntegrationsSection() {
  const integrations = [
    { name: "Jira", slug: "jira", color: "2684FF" },
    { name: "GitHub", slug: "github", color: "E6EDF3" },
    { name: "Slack", slug: "slack", color: "4A154B", useSlackSvg: true },
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
              {item.useSlackSvg ? (
                <SlackIcon size={16} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://cdn.simpleicons.org/${item.slug}/${item.color}`}
                  alt={item.name}
                  width={16}
                  height={16}
                  className="opacity-80"
                />
              )}
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

