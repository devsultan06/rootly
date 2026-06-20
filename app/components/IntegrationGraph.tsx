"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ──────────────────────────────────────────────
   TOOL DEFINITIONS with real brand logos
   ────────────────────────────────────────────── */

interface ToolNode {
  id: string;
  label: string;
  color: string;
  logo: string; // URL to real brand logo
  tooltip: string;
  x: number;
  y: number;
}

const TOOLS: ToolNode[] = [
  {
    id: "jira",
    label: "Jira",
    color: "#2684FF",
    logo: "https://cdn.simpleicons.org/jira/2684FF",
    tooltip: "Tickets, sprints & epics sync",
    x: 15,
    y: 18,
  },
  {
    id: "github",
    label: "GitHub",
    color: "#E6EDF3",
    logo: "https://cdn.simpleicons.org/github/E6EDF3",
    tooltip: "PRs, commits & code reviews",
    x: 50,
    y: 5,
  },
  {
    id: "slack",
    label: "Slack",
    color: "#4A154B",
    logo: "https://cdn.simpleicons.org/slack/4A154B",
    tooltip: "Threads, decisions & discussions",
    x: 85,
    y: 18,
  },
  {
    id: "linear",
    label: "Linear",
    color: "#5E6AD2",
    logo: "https://cdn.simpleicons.org/linear/5E6AD2",
    tooltip: "Issues, cycles & roadmaps",
    x: 92,
    y: 50,
  },
  {
    id: "zoom",
    label: "Zoom",
    color: "#0B5CFF",
    logo: "https://cdn.simpleicons.org/zoom/0B5CFF",
    tooltip: "Meeting recordings & transcripts",
    x: 82,
    y: 82,
  },
  {
    id: "googlemeet",
    label: "Google Meet",
    color: "#00897B",
    logo: "https://cdn.simpleicons.org/googlemeet/00897B",
    tooltip: "Live meeting context & action items",
    x: 50,
    y: 95,
  },
  {
    id: "vscode",
    label: "VS Code",
    color: "#007ACC",
    logo: "https://cdn.simpleicons.org/visualstudiocode/007ACC",
    tooltip: "Code context & file changes",
    x: 18,
    y: 82,
  },
  {
    id: "notion",
    label: "Notion",
    color: "#FFFFFF",
    logo: "https://cdn.simpleicons.org/notion/FFFFFF",
    tooltip: "Docs, wikis & knowledge base",
    x: 8,
    y: 50,
  },
  {
    id: "googlecalendar",
    label: "Calendar",
    color: "#4285F4",
    logo: "https://cdn.simpleicons.org/googlecalendar/4285F4",
    tooltip: "Sprint & standup scheduling",
    x: 35,
    y: 10,
  },
  {
    id: "confluence",
    label: "Confluence",
    color: "#172B4D",
    logo: "https://cdn.simpleicons.org/confluence/2684FF",
    tooltip: "Team docs & decision records",
    x: 65,
    y: 10,
  },
];

const CX = 50;
const CY = 50;

/* ──────────────────────────────────────────────
   MAIN INTEGRATION GRAPH
   ────────────────────────────────────────────── */
export default function IntegrationGraph() {
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const toSVG = useCallback((pct: number) => pct * 10, []);

  return (
    <section
      id="solutions"
      style={{
        position: "relative",
        padding: "100px 0 120px",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse at center bottom, rgba(20, 184, 166, 0.08) 0%, rgba(20, 184, 166, 0.03) 30%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Faint grid bg */}
      <div
        className="grid-pattern"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />

      <div
        className="container-main"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label reveal">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            Intelligence Graph
          </div>
          <h2
            className="section-title reveal delay-1"
            style={{ maxWidth: 600, margin: "0 auto 16px" }}
          >
            Connect everything.
            <br />
            Understand everything.
          </h2>
          <p
            className="section-subtitle reveal delay-2"
            style={{ margin: "0 auto" }}
          >
            Rootly builds a live knowledge graph across every engineering tool —
            so anyone can ask anything and get verified answers in seconds.
          </p>
        </div>

        {/* ─── GRAPH CONTAINER ─── */}
        <div
          className="reveal delay-3"
          style={{
            position: "relative",
            maxWidth: 900,
            margin: "0 auto",
            aspectRatio: "16 / 10",
          }}
        >
          {/* SVG connection layer */}
          <svg
            viewBox="0 0 1000 625"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter
                id="lineGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle
              cx={toSVG(CX)}
              cy={toSVG(CY)}
              r="120"
              fill="url(#centerGlow)"
            />

            {/* Pulse rings */}
            {[0, 1, 2].map((i) => (
              <circle
                key={`pulse-${i}`}
                cx={toSVG(CX)}
                cy={toSVG(CY)}
                r="40"
                fill="none"
                stroke="#14B8A6"
                strokeOpacity="0"
                strokeWidth="1"
              >
                <animate
                  attributeName="r"
                  values="40;120;160"
                  dur="4s"
                  begin={`${i * 1.33}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.15;0.06;0"
                  dur="4s"
                  begin={`${i * 1.33}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* Connection lines + particles */}
            {TOOLS.map((tool, i) => {
              const sx = toSVG(tool.x);
              const sy = toSVG(tool.y);
              const ex = toSVG(CX);
              const ey = toSVG(CY);
              const isHovered = hoveredTool === tool.id;
              const lineOpacity = hoveredTool ? (isHovered ? 0.5 : 0.06) : 0.14;

              const mx = (sx + ex) / 2 + (i % 2 === 0 ? 20 : -20);
              const my = (sy + ey) / 2 + (i % 3 === 0 ? 15 : -15);

              return (
                <g key={`line-${tool.id}`}>
                  {/* Connection line */}
                  <path
                    d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
                    fill="none"
                    stroke={isHovered ? tool.color : "#14B8A6"}
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    strokeOpacity={lineOpacity}
                    filter={isHovered ? "url(#lineGlow)" : undefined}
                    style={{ transition: "all 0.4s ease" }}
                  >
                    {mounted && (
                      <animate
                        attributeName="stroke-dasharray"
                        from="0 2000"
                        to="2000 0"
                        dur="1.5s"
                        begin={`${i * 0.12}s`}
                        fill="freeze"
                      />
                    )}
                  </path>

                  {/* Flow particles (tool → center) */}
                  {[0, 1, 2].map((p) => {
                    const dur = 3 + (i % 3) * 0.5;
                    const delay = i * 0.5 + p * (dur / 3);
                    return (
                      <circle
                        key={`p-${tool.id}-${p}`}
                        r={isHovered ? 2.5 : 1.5}
                        fill={tool.color}
                        opacity="0"
                        style={{ transition: "r 0.3s ease" }}
                      >
                        <animate
                          attributeName="opacity"
                          values="0;0.7;0.7;0"
                          keyTimes="0;0.15;0.75;1"
                          dur={`${dur}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                        />
                        <animateMotion
                          dur={`${dur}s`}
                          begin={`${delay}s`}
                          repeatCount="indefinite"
                          path={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
                        />
                      </circle>
                    );
                  })}

                  {/* Reverse particle (center → tool) */}
                  <circle r="1.2" fill="#14B8A6" opacity="0">
                    <animate
                      attributeName="opacity"
                      values="0;0.5;0.5;0"
                      keyTimes="0;0.15;0.75;1"
                      dur={`${4 + i * 0.3}s`}
                      begin={`${i * 0.8 + 2}s`}
                      repeatCount="indefinite"
                    />
                    <animateMotion
                      dur={`${4 + i * 0.3}s`}
                      begin={`${i * 0.8 + 2}s`}
                      repeatCount="indefinite"
                      path={`M${ex},${ey} Q${mx},${my} ${sx},${sy}`}
                    />
                  </circle>
                </g>
              );
            })}

            {/* Center node */}
            <g transform={`translate(${toSVG(CX)}, ${toSVG(CY)})`}>
              <circle
                r="32"
                fill="#0F0F14"
                stroke="#14B8A6"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              >
                <animate
                  attributeName="stroke-opacity"
                  values="0.3;0.6;0.3"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                r="28"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
              {/* Root icon */}
              <g transform="translate(-12, -14)" opacity="0.9">
                <path
                  d="M12 0L12 8M12 8C12 8 6 12 6 16C6 20 9 24 12 24C15 24 18 20 18 16C18 12 12 8 12 8Z"
                  stroke="#14B8A6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M8 18C8 18 4 17 2 20M16 18C16 18 20 17 22 20"
                  stroke="#14B8A6"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.7"
                />
              </g>
            </g>
          </svg>

          {/* ─── TOOL NODES (HTML overlay with real logos) ─── */}
          {TOOLS.map((tool, i) => {
            const isHovered = hoveredTool === tool.id;
            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                style={{
                  position: "absolute",
                  left: `${tool.x}%`,
                  top: `${tool.y}%`,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "default",
                  zIndex: isHovered ? 10 : 2,
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.3s ease`,
                }}
              >
                {/* Icon container with REAL brand logo */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: isHovered
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${
                      isHovered ? `${tool.color}44` : "rgba(255,255,255,0.06)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    boxShadow: isHovered
                      ? `0 0 20px ${tool.color}15, 0 4px 12px rgba(0,0,0,0.3)`
                      : "0 2px 8px rgba(0,0,0,0.2)",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {tool.id === "slack" ? (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
                      <path fill="#E01E5A" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
                      <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" />
                      <path fill="#36C5F0" d="M8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
                      <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" />
                      <path fill="#2EB67D" d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
                      <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" />
                      <path fill="#ECB22E" d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                    </svg>
                  ) : tool.id === "vscode" ? (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="#007ACC"
                    >
                      <path d="M17.583.063a1.5 1.5 0 0 0-1.032.392 1.5 1.5 0 0 0-.001 0L7.04 9.146 2.96 6.088a1 1 0 0 0-1.274.078L.32 7.467a1 1 0 0 0 0 1.474l3.588 3.06-3.588 3.059a1 1 0 0 0 0 1.474l1.366 1.3a1 1 0 0 0 1.274.079l4.08-3.059 9.51 8.692a1.5 1.5 0 0 0 1.033.391 1.5 1.5 0 0 0 .677-.163l4.422-2.123A1.5 1.5 0 0 0 24 20.249V3.75a1.5 1.5 0 0 0-.918-1.384L18.66.243a1.5 1.5 0 0 0-.677-.163 1.5 1.5 0 0 0-.399.017zM18 6.92v10.163l-6.198-5.08z" />
                    </svg>
                  ) : (
                    <img
                      src={tool.logo}
                      alt={tool.label}
                      width={22}
                      height={22}
                      style={{
                        filter: isHovered
                          ? "brightness(1.2)"
                          : "brightness(0.85)",
                        transition: "filter 0.3s ease",
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: isHovered ? "#E5E7EB" : "#6B7280",
                    letterSpacing: "-0.01em",
                    transition: "color 0.3s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tool.label}
                </span>

                {/* Tooltip */}
                {isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: -36,
                      padding: "6px 12px",
                      background: "rgba(17, 17, 17, 0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      fontSize: 11,
                      color: "#D1D5DB",
                      whiteSpace: "nowrap",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      animation: "tooltipIn 0.2s ease forwards",
                      zIndex: 20,
                    }}
                  >
                    {tool.tooltip}
                  </div>
                )}
              </div>
            );
          })}

          {/* Center label */}
          <div
            style={{
              position: "absolute",
              left: `${CX}%`,
              top: `${CY}%`,
              transform: "translate(-50%, 42px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#C7D2FE",
                letterSpacing: "-0.02em",
              }}
            >
              Rootly
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#6B7280",
                letterSpacing: "0.02em",
              }}
            >
              Intelligence Graph
            </span>
          </div>
        </div>

        {/* Tool names strip */}
        <div
          className="reveal delay-4"
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 13,
            color: "#6B7280",
            letterSpacing: "0.01em",
          }}
        >
          <span style={{ color: "#9CA3AF" }}>Jira</span>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>•</span>
          <span style={{ color: "#9CA3AF" }}>GitHub</span>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>•</span>
          <span style={{ color: "#9CA3AF" }}>Slack</span>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>•</span>
          <span style={{ color: "#9CA3AF" }}>Meetings</span>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>•</span>
          <span style={{ color: "#9CA3AF" }}>Code</span>
          <span style={{ margin: "0 10px", opacity: 0.3 }}>—</span>
          <span style={{ color: "#14B8A6" }}>
            One living intelligence layer.
          </span>
        </div>
      </div>

      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
